package br.gov.serpro.supde.infra.batch.core.support.ods;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.net.URI;
import java.net.URL;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.util.StringUtils;

public class ODSBuilder {
	
	private static final String TEMPLATE_PATH = "ods/template/";
	private static final String CONTENT_PATH = "content.xml";

	public static void build(URI content, File destOdsFile) throws Exception {
		ZipOutputStream zip = null;
		FileOutputStream fileWriter = null;

		fileWriter = new FileOutputStream(destOdsFile);
		zip = new ZipOutputStream(fileWriter);

		URL res = ODSBuilder.class.getClassLoader().getResource(TEMPLATE_PATH);

		File templateFolder = new File(res.toURI());
		for (String fileName : templateFolder.list()) {
			if(!fileName.equals(CONTENT_PATH)) {
				addFileToZip("", new URL(res + "/" + fileName).toURI(), zip, null);
			}
		}

		addFileToZip("", content, zip, CONTENT_PATH);
		
		zip.flush();
		zip.close();
	}

	private static void addFolderToZip(String path, URI srcFolder, ZipOutputStream zip) throws Exception {
		File folder = new File(srcFolder);

		for (String fileName : folder.list()) {
			if (path.equals("")) {
				addFileToZip(folder.getName(), new URL(srcFolder + "/" + fileName).toURI(), zip, null);
			} else {
				addFileToZip(path + "/" + folder.getName(), new URL(srcFolder + "/" + fileName).toURI(), zip, null);
			}
		}
	}

	private static void addFileToZip(String path, URI srcFile, ZipOutputStream zip, String entryName) throws Exception {
		File file = new File(srcFile);
		if (file.isDirectory()) {
			addFolderToZip(path, srcFile, zip);
		} else {
			byte[] buf = new byte[1024];
			int len;
			FileInputStream in = new FileInputStream(new File(srcFile));
			if(StringUtils.hasText(entryName)) {
				zip.putNextEntry(new ZipEntry(entryName));
			} else {
				zip.putNextEntry(new ZipEntry(path + "/" + file.getName()));
			}
			while ((len = in.read(buf)) > 0) {
				zip.write(buf, 0, len);
			}
			in.close();
		}
	}
}
