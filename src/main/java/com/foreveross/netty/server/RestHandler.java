package com.foreveross.netty.server;

public interface RestHandler {

	RestHandler create();

	boolean process(ProcessContext ctx);

	boolean matchUri(String uri);

	int getOrder();
}