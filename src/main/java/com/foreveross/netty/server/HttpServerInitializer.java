package com.foreveross.netty.server;

import org.iff.infra.util.Assert;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.ssl.SslContext;

public class HttpServerInitializer extends ChannelInitializer<SocketChannel> {

	protected HTTPServer server;
	protected SslContext sslCtx;
	protected boolean sslEnable;

	public HttpServerInitializer(HTTPServer server, SslContext sslCtx, boolean sslEnable) {
		super();
		Assert.notNull(server);
		Assert.notNull(sslCtx);
		this.server = server;
		this.sslCtx = sslCtx;
		this.sslEnable = sslEnable;
	}

	@Override
	protected void initChannel(SocketChannel ch) throws Exception {
		if (sslEnable) {
			ch.pipeline().addLast(sslCtx.newHandler(ch.alloc()));
		}
		ch.pipeline().addLast(new HttpServerCodec());
		ch.pipeline().addLast(new HttpObjectAggregator(65536));
		ch.pipeline().addLast(new HttpServerInboundHandler(server));
	}

}