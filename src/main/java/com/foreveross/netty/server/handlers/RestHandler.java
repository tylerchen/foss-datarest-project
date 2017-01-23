/*******************************************************************************
 * Copyright (c) Sep 25, 2016 @author <a href="mailto:iffiff1@gmail.com">Tyler Chen</a>.
 * All rights reserved.
 *
 * Contributors:
 *     <a href="mailto:iffiff1@gmail.com">Tyler Chen</a> - initial API and implementation
 ******************************************************************************/
package com.foreveross.netty.server.handlers;

import com.foreveross.netty.server.ProcessContext;

/**
 * rest handler.
 * @author <a href="mailto:iffiff1@gmail.com">Tyler Chen</a> 
 * @since Sep 25, 2016
 */
public interface RestHandler {

	RestHandler create();

	boolean process(ProcessContext ctx);

	boolean matchUri(String uri);

	int getOrder();
}