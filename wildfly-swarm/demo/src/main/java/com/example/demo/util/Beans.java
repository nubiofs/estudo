/*
 * Demoiselle Framework
 * Copyright (C) 2010 SERPRO
 * ----------------------------------------------------------------------------
 * This file is part of Demoiselle Framework.
 * 
 * Demoiselle Framework is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License version 3
 * as published by the Free Software Foundation.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License version 3
 * along with this program; if not,  see <http://www.gnu.org/licenses/>
 * or write to the Free Software Foundation, Inc., 51 Franklin Street,
 * Fifth Floor, Boston, MA  02110-1301, USA.
 * ----------------------------------------------------------------------------
 * Este arquivo é parte do Framework Demoiselle.
 * 
 * O Framework Demoiselle é um software livre; você pode redistribuí-lo e/ou
 * modificá-lo dentro dos termos da GNU LGPL versão 3 como publicada pela Fundação
 * do Software Livre (FSF).
 * 
 * Este programa é distribuído na esperança que possa ser útil, mas SEM NENHUMA
 * GARANTIA; sem uma garantia implícita de ADEQUAÇÃO a qualquer MERCADO ou
 * APLICAÇÃO EM PARTICULAR. Veja a Licença Pública Geral GNU/LGPL em português
 * para maiores detalhes.
 * 
 * Você deve ter recebido uma cópia da GNU LGPL versão 3, sob o título
 * "LICENCA.txt", junto com esse programa. Se não, acesse <http://www.gnu.org/licenses/>
 * ou escreva para a Fundação do Software Livre (FSF) Inc.,
 * 51 Franklin St, Fifth Floor, Boston, MA 02111-1301, USA.
 */
package com.example.demo.util;

import java.lang.annotation.Annotation;
import java.lang.reflect.Member;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.HashSet;
import java.util.NoSuchElementException;
import java.util.Set;

import javax.enterprise.context.spi.CreationalContext;
import javax.enterprise.inject.spi.Annotated;
import javax.enterprise.inject.spi.Bean;
import javax.enterprise.inject.spi.BeanManager;
import javax.enterprise.inject.spi.CDI;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.inject.Named;
import javax.naming.InitialContext;
import javax.naming.NamingException;

@Named("Beans")
public final class Beans {

	private static BeanManager beanManager = CDI.current().getBeanManager();

	private Beans() {
	}

//	public static void setBeanManager(BeanManager manager) {
//		beanManager = manager;
//	}

	public static BeanManager getBeanManager() {
		return beanManager;
	}

	/**
	 * Obtains a injectble instance of a bean, which have the given EL name and are available for injection in the point
	 * where this method was call.
	 * 
	 * @param beanName
	 *            the EL name for the requested bean.
	 * @return Type a instace of the injected beanClass.
	 * @throws DemoiselleException
	 *             if no bean are avaliable to be injected for the given bean name.
	 */
	public static <T> T getReference(String beanName) {
		T instance;

		try {
			instance = (T) createReference(getBeanManager().getBeans(beanName), (Class<T>) null);

		} catch (NoSuchElementException cause) {
			//String message = getBundle().getString("bean-not-found", beanName);
			//throw new DemoiselleException(message, cause);
			throw new IllegalAccessError("Error");
		}

		return instance;
	}

	public static <T> T getReference(final Class<T> beanClass) {
		return getReference(beanClass, (Annotation[]) null);
	}

	/////
	
	   private static BeanManager getBeanManager2() {
	        try {
	            InitialContext initialContext = new InitialContext();
	            return (BeanManager) initialContext.lookup("java:comp/BeanManager");
	        } catch (NamingException e) {
	            throw new RuntimeException(e);
	        }
	    }

	    public static <T> T getFacade(Class<T> clazz) {
	        BeanManager bm = getBeanManager2();
	        Bean<T> bean = (Bean<T>) bm.getBeans(clazz).iterator().next();
	        CreationalContext<T> ctx = bm.createCreationalContext(bean);
	        T object = (T) bm.getReference(bean, clazz, ctx);
	        return object;
	}
	
	
	/////
	
	
	/**
	 * Obtains a injectble instance of a bean, which have the given required type and qualifiers, and are available for
	 * injection in the point where this method was call.
	 * 
	 * @param beanClass
	 *            the beanClass which instace is requested to be obtained.
	 * @param qualifiers
	 *            a set of qualifiers with any quantity of elements (zero including).
	 * @return Type a instace of the injected beanClass.
	 * @throws DemoiselleException
	 *             if no bean are avaliable to be injected for the given Class and qualifiers.
	 */
	public static <T> T getReference(final Class<T> beanClass, Annotation... qualifiers) {
		T instance;

		try {
			Set<Bean<?>> beans;
			if (qualifiers == null) {
				beans = getBeanManager().getBeans(beanClass);
			} else {
				beans = getBeanManager().getBeans(beanClass, qualifiers);
			}

			instance = (T) createReference(beans, beanClass, qualifiers);

		} catch (NoSuchElementException cause) {
			StringBuffer buffer = new StringBuffer();
			buffer.append(beanClass.getCanonicalName());

			if (qualifiers != null) {
				for (Annotation qualifier : qualifiers) {
					buffer.append(", ");
					buffer.append(qualifier.getClass().getCanonicalName());
				}
			}

//			String message = getBundle().getString("bean-not-found", buffer.toString());
//			throw new DemoiselleException(message, cause);
			throw new IllegalAccessError("Error");
			
		}

		return instance;
	}

	@SuppressWarnings("unchecked")
	private static <T> T createReference(Set<Bean<?>> beans, Class<T> beanClass, Annotation... qualifiers) {
		if (beans.size() > 1) {
//			String message = getBundle().getString("ambiguous-bean-resolution", beanClass.getName(), beans.toString());
//			throw new DemoiselleException(message, new AmbiguousResolutionException());
			throw new IllegalAccessError("Error");
		}

		Bean<?> bean = beans.iterator().next();
		CreationalContext<?> context = getBeanManager().createCreationalContext(bean);
		Type beanType = beanClass == null ? bean.getBeanClass() : beanClass;
		InjectionPoint injectionPoint;

		if (qualifiers == null) {
			injectionPoint = new ProgramaticInjectionPoint(bean, beanType);
		} else {
			injectionPoint = new ProgramaticInjectionPoint(bean, beanType, qualifiers);
		}

		return (T) getBeanManager().getInjectableReference(injectionPoint, context);
	}

	/*
	 * private static <T> T getReference(Set<Bean<?>> beans) { return getReference(beans, (Class<T>) null, (Member)
	 * null); }
	 */

//	private static ResourceBundle getBundle() {
//		return Beans.getReference(ResourceBundle.class, new NameQualifier("demoiselle-core-bundle"));
//	}

	/**
	 * <p>
	 * A dummy injection point created when getting a new bean through one of the {@link Beans#getReference} methods.
	 * </p>
	 * <p>
	 * This dummy injection point returns valid values for {@link #getBean()}, {@link #getType()} and
	 * {@link #getQualifiers()} methods, but it always returns <code>null</code> for {@link #getMember()} as there is no
	 * real class member where the bean was injected.
	 * </p>
	 * <p>
	 * This injection point also always return <code>false</code> for {@link #isDelegate()} and {@link #isTransient()}.
	 * In the case of {@link #isTransient()} there is no real way to know if the field receiving the value of
	 * {@link Beans#getReference} is transient, so take special care when assigning non-serializable beans into
	 * non-transient fields of serializable classes.
	 * </p>
	 * 
	 * @author SERPRO
	 */
	public static final class ProgramaticInjectionPoint implements InjectionPoint {

		private final Bean<?> bean;

		private final Type beanType;

		private final Set<Annotation> qualifiers;

		public ProgramaticInjectionPoint(Bean<?> bean, Type beanType, Annotation... qualifiers) {
			this.bean = bean;
			this.beanType = beanType;
			this.qualifiers = new HashSet<Annotation>(Arrays.asList(qualifiers));
		}

		@Override
		public Type getType() {
			return this.beanType;
		}

		@Override
		public Set<Annotation> getQualifiers() {
			return this.qualifiers;
		}

		@Override
		public Bean<?> getBean() {
			return this.bean;
		}

		@Override
		public Member getMember() {
			return null;
		}

		@Override
		public boolean isDelegate() {
			return false;
		}

		@Override
		public boolean isTransient() {
			return false;
		}

		@Override
		public Annotated getAnnotated() {
			return new Annotated() {

				@Override
				public Type getBaseType() {
					// TODO Auto-generated method stub
					return null;
				}

				@Override
				public Set<Type> getTypeClosure() {
					// TODO Auto-generated method stub
					return null;
				}

				@Override
				@SuppressWarnings("unchecked")
				public <T extends Annotation> T getAnnotation(Class<T> annotationType) {
					T result = null;

					for (Annotation annotation : getAnnotations()) {
						if (annotation.annotationType() == annotationType) {
							result = (T) annotation;
							break;
						}
					}

					return result;
				}

				@Override
				public Set<Annotation> getAnnotations() {
					return qualifiers;
				}

				@Override
				public boolean isAnnotationPresent(Class<? extends Annotation> annotationType) {
					return qualifiers.contains(annotationType);
				}
			};
		}
	}
}
