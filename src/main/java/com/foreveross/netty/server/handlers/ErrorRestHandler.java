/*******************************************************************************
 * Copyright (c) Sep 24, 2016 @author <a href="mailto:iffiff1@gmail.com">Tyler Chen</a>.
 * All rights reserved.
 *
 * Contributors:
 *     <a href="mailto:iffiff1@gmail.com">Tyler Chen</a> - initial API and implementation
 ******************************************************************************/
package com.foreveross.netty.server.handlers;

import java.nio.charset.Charset;

import com.foreveross.netty.server.ProcessContext;

import io.netty.handler.codec.http.HttpResponseStatus;

/**
 * if error occur.
 * @author <a href="mailto:iffiff1@gmail.com">Tyler Chen</a> 
 * @since Sep 24, 2016
 */
public class ErrorRestHandler implements RestHandler {

	@Override
	public boolean process(ProcessContext ctx) {
		ctx.getOutputBuffer().writeCharSequence("[500] error: " + ctx.getAttributes().get("error"),
				Charset.forName("UTF-8"));
		ctx.getResponse().setStatus(HttpResponseStatus.BAD_REQUEST);
		ctx.outputText();
		return true;
	}

	@Override
	public boolean matchUri(String uri) {
		return true;
	}

	@Override
	public int getOrder() {
		return 1000;
	}

	@Override
	public RestHandler create() {
		return this;
	}

}
