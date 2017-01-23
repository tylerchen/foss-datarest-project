/*
 * Copyright 2012 The Netty Project
 *
 * The Netty Project licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
package com.foreveross.netty.server;

import java.util.List;

import org.iff.infra.util.Assert;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.DecoderException;
import io.netty.handler.codec.MessageToMessageDecoder;
import io.netty.handler.codec.compression.ZlibCodecFactory;
import io.netty.handler.codec.compression.ZlibWrapper;
import io.netty.handler.codec.http.HttpContentCompressor;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslHandler;
import io.netty.util.ReferenceCountUtil;

/**
 * Manipulates the current pipeline dynamically to switch protocols or enable
 * SSL or GZIP.
 */
@io.netty.channel.ChannelHandler.Sharable
public class PortUnificationServerHandler extends ChannelInboundHandlerAdapter {

	private final SslContext sslCtx;
	private final boolean detectSsl;
	private final boolean detectGzip;
	private final HTTPServer server;

	public PortUnificationServerHandler(HTTPServer server, SslContext sslCtx) {
		this(server, sslCtx, true, true);
	}

	private PortUnificationServerHandler(HTTPServer server, SslContext sslCtx, boolean detectSsl, boolean detectGzip) {
		this.sslCtx = sslCtx;
		this.detectSsl = detectSsl;
		this.detectGzip = detectGzip;
		this.server = server;
		Assert.notNull(server, "HTTPServer is required!");
	}

	@Override
	public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
		if (!(msg instanceof ByteBuf)) {
			ctx.fireChannelRead(msg);
		}
		boolean needRelease = false;
		try {
			decode(ctx, (ByteBuf) msg);
			ctx.fireChannelRead(msg);
		} catch (DecoderException e) {
			needRelease = true;
			throw e;
		} catch (Throwable e) {
			needRelease = true;
			throw new DecoderException(e);
		} finally {
			if (needRelease) {
				ReferenceCountUtil.safeRelease(msg);
			}
		}
	}

	protected boolean decode(ChannelHandlerContext ctx, ByteBuf in) throws Exception {
		/*Will use the first five bytes to detect a protocol.*/
		boolean needRelease = false;
		if (in.readableBytes() < 2) {
			return needRelease;
		}

		if (in.readableBytes() > 4 && isSsl(in)) {
			enableSsl(ctx);
			needRelease = true;
		} else {
			final int magic1 = in.getUnsignedByte(in.readerIndex());
			final int magic2 = in.getUnsignedByte(in.readerIndex() + 1);
			if (isGzip(magic1, magic2)) {
				enableGzip(ctx);
				needRelease = true;
			} else if (isHttp(magic1, magic2)) {
				switchToHttp(ctx);
			} else if (isBinnary(magic1, magic2)) {
				switchToBinnary(ctx);
			} else {
				/*Unknown protocol; discard everything and close the connection.*/
				in.clear();
				in.release();
				ctx.close();
			}
		}
		return needRelease;
	}

	private boolean isSsl(ByteBuf buf) {
		if (detectSsl) {
			return SslHandler.isEncrypted(buf);
		}
		return false;
	}

	private boolean isGzip(int magic1, int magic2) {
		if (detectGzip) {
			return magic1 == 31 && magic2 == 139;
		}
		return false;
	}

	private static boolean isHttp(int magic1, int magic2) {
		return magic1 == 'G' && magic2 == 'E' || /*GET*/
				magic1 == 'P' && magic2 == 'O' || /*POST*/
				magic1 == 'P' && magic2 == 'U' || /*PUT*/
				magic1 == 'H' && magic2 == 'E' || /*HEAD*/
				magic1 == 'O' && magic2 == 'P' || /*OPTIONS*/
				magic1 == 'P' && magic2 == 'A' || /*PATCH*/
				magic1 == 'D' && magic2 == 'E' || /*DELETE*/
				magic1 == 'T' && magic2 == 'R' || /*TRACE*/
				magic1 == 'C' && magic2 == 'O'; /*CONNECT*/
	}

	private static boolean isBinnary(int magic1, int magic2) {
		return magic1 == 'J' && magic2 == 'K';/*JAVA Kryo BINNARY*/
	}

	private void enableSsl(ChannelHandlerContext ctx) {
		ChannelPipeline p = ctx.pipeline();
		p.addLast("ssl", sslCtx.newHandler(ctx.alloc()));
		p.addLast("unificationA", new PortUnificationServerHandler(server, sslCtx, false, detectGzip));
		p.remove(this);
	}

	private void enableGzip(ChannelHandlerContext ctx) {
		ChannelPipeline p = ctx.pipeline();
		p.addLast("gzipdeflater", ZlibCodecFactory.newZlibEncoder(ZlibWrapper.GZIP));
		p.addLast("gzipinflater", ZlibCodecFactory.newZlibDecoder(ZlibWrapper.GZIP));
		p.addLast("unificationB", new PortUnificationServerHandler(server, sslCtx, detectSsl, false));
		p.remove(this);
	}

	private void switchToHttp(ChannelHandlerContext ctx) {
		ChannelPipeline p = ctx.pipeline();
		p.addLast("codec", new HttpServerCodec());
		p.addLast("deflater", new HttpContentCompressor());
		p.addLast("combine", new HttpObjectAggregator(65536));
		p.addLast("handler", new HttpServerInboundHandler(server));
		p.remove(this);
	}

	private void switchToBinnary(ChannelHandlerContext ctx) {
		//		ChannelPipeline p = ctx.pipeline();
		//		p.addLast("decoder", new BigIntegerDecoder());
		//		p.addLast("encoder", new NumberEncoder());
		//		p.addLast("handler", new FactorialServerHandler());
		//		p.remove(this);
	}
}