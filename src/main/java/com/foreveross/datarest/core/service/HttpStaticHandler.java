package com.foreveross.datarest.core.service;

/**
 * Created by kevin on 2017/2/10.
 */

import io.netty.channel.*;
import io.netty.handler.codec.http.*;
import io.netty.handler.ssl.SslHandler;
import io.netty.handler.stream.ChunkedNioFile;

import java.io.File;
import java.io.RandomAccessFile;
import java.net.URL;


public class HttpStaticHandler extends SimpleChannelInboundHandler<FullHttpRequest> {

    @Override
    public void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {

        String uri = request.uri();
        if (!uri.contains("src")) {
            ctx.fireChannelRead(request.retain());
        } else {

            if (HttpUtil.is100ContinueExpected(request)) {
                send100Continue(ctx);
            }

            URL location = HttpStaticHandler.class.getProtectionDomain().getCodeSource().getLocation();
            String path = location.toURI() + uri.substring(1);
            path = !path.contains("file:") ? path : path.substring(5);

            if(path.contains("?")) {
                path = path.substring(0, path.indexOf("?"));
            }

            File staticFile = new File(path);

            HttpResponse response = new DefaultHttpResponse(request.protocolVersion(), HttpResponseStatus.OK);

            //response.headers().set("Access-Control-Allow-Origin", "*");
            //response.headers().set("Access-Control-Allow-Methods", "GET, OPTIONS");
            //response.headers().set("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With");
            //response.headers().set("Access-Control-Allow-Credentials", "true");

          String contentType;
            if(uri.endsWith(".js")) {
                contentType = "application/x-javascript; charset=UTF-8";
            } else if(uri.endsWith(".css")) {
                contentType = "text/css; charset=UTF-8";
            } else {
                contentType = "text/html; charset=UTF-8";
            }
            /*  else if (uri.endsWith(".ttf")) {
                contentType = "application/x-font-ttf;";
                response.headers().set("Access-Control-Allow-Origin", "*");
            } else if(uri.endsWith(".woff")) {
                contentType = "font/x-woff;";
                response.headers().set("Access-Control-Allow-Origin", "*");
            } else if(uri.endsWith(".otf")) {
                contentType = "font/opentype;";
                response.headers().set("Access-Control-Allow-Origin", "*");
            } else if(uri.endsWith(".eot")) {
                contentType = "application/vnd.ms-fontobject;";
                response.headers().set("Access-Control-Allow-Origin", "*");
            }
            */
            response.headers().set(HttpHeaders.Names.CONTENT_TYPE, contentType);
            //response.headers().set(HttpHeaders.Names.ACCEPT_RANGES, "bytes");
            //response.headers().set(HttpHeaders.Names.TRANSFER_ENCODING, "chunked");
            //response.headers().set(HttpHeaders.Names.VARY, "Accept-Encoding");

            final boolean keepAlive = HttpHeaders.isKeepAlive(request);

            final RandomAccessFile file = new RandomAccessFile(staticFile, "r");


            if (keepAlive) {
                response.headers().set(HttpHeaders.Names.CONTENT_LENGTH, file.length());
                response.headers().set(HttpHeaders.Names.CONNECTION, HttpHeaders.Values.KEEP_ALIVE);
            }

            //response.headers().set("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            //response.headers().set("Pragma", "no-cache"); // HTTP 1.0.
            //response.headers().set("Expires", "0");
            response.headers().set("Content-length", file.length());
            ctx.write(response);

            if (ctx.pipeline().get(SslHandler.class) == null) {     //7
                ctx.write(new DefaultFileRegion(file.getChannel(), 0, file.length()));
            } else {
                ctx.write(new ChunkedNioFile(file.getChannel()));
            }
            ChannelFuture future = ctx.writeAndFlush(LastHttpContent.EMPTY_LAST_CONTENT);
            if (!keepAlive) {
                future.addListener(ChannelFutureListener.CLOSE);
            }

            file.close();
        }
    }

    private static void send100Continue(ChannelHandlerContext ctx) {
        FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.CONTINUE);
        ctx.writeAndFlush(response);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause)
            throws Exception {
        Channel incoming = ctx.channel();
        System.out.println("Client:"+incoming.remoteAddress()+"异常");
        // 当出现异常就关闭连接
        cause.printStackTrace();
        ctx.close();
    }
}