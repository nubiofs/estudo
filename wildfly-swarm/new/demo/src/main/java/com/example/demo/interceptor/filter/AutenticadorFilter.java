package com.example.demo.interceptor.filter;

import static javax.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.demo.interceptor.AutenticacaoInterceptor;

@WebFilter(filterName = "AutenticadorFilter", urlPatterns = {"/*"})
//@WebFilter(filterName = "AutenticadorFilter", urlPatterns = {"/*/authJwt/*"})
public class AutenticadorFilter implements Filter {

	private Logger LOG = LoggerFactory.getLogger(AutenticadorFilter.class);
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		try {

			chain.doFilter(request, response);

		} catch (IOException | ServletException e) {
			
			throw e;
			
		} catch (Exception e){

			String authJwt = ((HttpServletRequest) request).getHeader(AutenticacaoInterceptor.AUTHORIZATION_HEADER);
			
			if(StringUtils.isNotEmpty(authJwt)) {
				LOG.debug("Header AUTHORIZATION OK: {}", authJwt);
				((HttpServletResponse) response).setStatus(SC_UNAUTHORIZED);
				((HttpServletResponse) response).setContentType("text/plain; charset=UTF-8");
				((HttpServletResponse) response).getWriter().write(e.getLocalizedMessage());
			} else {
				LOG.debug("NOT Header AUTHORIZATION.");
			}

		}

	}

	@Override
	public void destroy() {

	}

}
