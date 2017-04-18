package br.gov.serpro.supde.infra.batch.core.context;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationContextException;

/**
 * Fábrica que recupera instâncias de beans definidos nos arquivos de
 * configuração do Spring.
 * 
 * Por implementar a interface {@link ApplicationContextAware}, é notificado
 * automaticamente pelo Spring quando um {@link ApplicationContext} é criado.
 * 
 * Essa classe também deve ser definida em um arquivo de configuração do Spring,
 * com escopo de Singleton.
 * 
 */
public class SpringContextFactory implements ApplicationContextAware {

	/**
	 * Mantém o estado da {@link ApplicationContext} carregada pelo Spring
	 */
	private static ApplicationContext applicationContext;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		SpringContextFactory.applicationContext = applicationContext;
	}

	public static Object getBean(String beanName) throws BeansException {

		if (SpringContextFactory.applicationContext != null) {
			return SpringContextFactory.applicationContext.getBean(beanName);
		} else {
			throw new ApplicationContextException("Application context hasn't been initialized");
		}

	}

	public static Object getBean(Class<?> type) throws BeansException {

		if (SpringContextFactory.applicationContext != null) {
			return SpringContextFactory.applicationContext.getBean(type);
		} else {
			throw new ApplicationContextException("Application context hasn't been initialized");
		}

	}

	public static boolean containsBeanOfType(Class<?> type) {

		if (SpringContextFactory.applicationContext != null) {
			return !applicationContext.getBeansOfType(type).isEmpty();
		}

		else {
			return false;
		}

	}

	public static boolean isContextInitialized() {
		return SpringContextFactory.applicationContext != null;
	}

}
