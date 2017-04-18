package br.gov.serpro.supde.infra.batch.core.report;

import java.util.Date;

/**
 * <p>
 * Métodos utilitários para a geração dos relatórios de execução
 * </p>
 * 
 */
public class JobReportUtil {

	/**
	 * <p>
	 * Calcula a duração entre duas datas.
	 * </p>
	 * 
	 * @param startTime
	 * @param endTime
	 * @return Uma string no formato 00:00:00, representando a duração entre duas datas.
	 */
	public static String getDurationBetween(Date startTime, Date endTime) {

		if (startTime == null || endTime == null) {
			return "N/D";
		}

		long diff = endTime.getTime() - startTime.getTime();

		long diffSeconds = diff / 1000 % 60;
		long diffMinutes = diff / (60 * 1000) % 60;
		long diffHours = diff / (60 * 60 * 1000);
		
		return String.format("%02d:%02d:%02d", diffHours, diffMinutes, diffSeconds);
	}

	/**
	 * <p>
	 * Recupera a URL "pai" da URL passada como parâmetro.
	 * </p>
	 * 
	 * <p>
	 * A URL pai é uma substring da URL original, até a última barra ("/").
	 * Por exemplo, para a URL "file://minha/url/completa.txt", a URL "pai" será
	 * "file://minha/url/".
	 * </p>
	 * 
	 * @param url
	 * @return a URL "pai"
	 */
	public static String getParentUrl(String url) {
		
		if (isEmpty(url)) {
			return url;
		}
		
		url = url.replace('\\', '/');
		int endIndex = 0;
		char c = url.charAt(url.length() - 1);
		
		if (c == '/') {
			url = url.substring(0, url.length() - 1);
		}
		
		for (int index = url.length() - 1; index >= 0; index--) {
			if (url.charAt(index) == '/') {
				endIndex = index;
				index = 0;
			}
		}
		
		return url.substring(0, endIndex) + ((endIndex != 0) ? '/' : "");
	}

	/**
	 * <p>Indica se uma String está vazia.</p>
	 * @param str
	 * @return
	 */
	public static boolean isEmpty(String str) {
        return str == null || str.length() == 0;
    }

}
