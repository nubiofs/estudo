package com.lordofthejars.nosqlunit.core;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.ArrayList;
import java.util.List;

public final class IOUtils {

	private IOUtils() {
		super();
	}
	
	public static boolean deleteDir(File dir) {
	    if (dir.isDirectory()) {
	        String[] children = dir.list();
	        for (int i=0; i<children.length; i++) {
	            boolean success = deleteDir(new File(dir, children[i]));
	            if (!success) {
	                return false;
	            }
	        }
	    }

	    return dir.delete();
	}
	
	public static Class<?> getClassWithAnnotation(final Class<?> source, final Class<? extends Annotation> annotationClass) {
	    
	    Class<?> nextSource = source;
	    while (nextSource != Object.class) {
	        if(nextSource.isAnnotationPresent(annotationClass)) {
	            return nextSource;
	        } else {
	            nextSource = nextSource.getSuperclass();
	        }
	    }
	    
	    return null;
	}
	
	public static List<Field> getFieldsWithAnnotation(final Class<?> source,
            final Class<? extends Annotation> annotationClass) {
        List<Field> declaredAccessableFields = AccessController
                .doPrivileged(new PrivilegedAction<List<Field>>() {
                    public List<Field> run() {
                        List<Field> foundFields = new ArrayList<Field>();
                        Class<?> nextSource = source;
                        while (nextSource != Object.class) {
                            for (Field field : nextSource.getDeclaredFields()) {
                                if (field.isAnnotationPresent(annotationClass)) {
                                    if (!field.isAccessible()) {
                                        field.setAccessible(true);
                                    }
                                    foundFields.add(field);
                                }
                            }
                            nextSource = nextSource.getSuperclass();
                        }
                        return foundFields;
                    }
                });
        return declaredAccessableFields;
    }
	
	public static boolean isFileAvailableOnClasspath(Class<?> resourceBase, String dataLocation) {
		return resourceBase.getResourceAsStream(dataLocation) != null;
	}
	
	public static List<InputStream> getAllStreamsFromClasspathBaseResource(Class<?> resourceBase, String[] dataLocations) {
		
		final List<InputStream> scriptContent = new ArrayList<InputStream>();
		
		for (int i=0;i<dataLocations.length;i++) {
			InputStream content = getStreamFromClasspathBaseResource(resourceBase, dataLocations[i]);
			
			if(content != null) {
				scriptContent.add(content);
			}
		}
		
		return scriptContent;
	}
	
	public static InputStream getStreamFromClasspathBaseResource(Class<?> resourceBase, String dataLocation) {
		
		if(isFileAvailableOnClasspath(resourceBase, dataLocation)) {
			return resourceBase.getResourceAsStream(dataLocation);
		} else {
			return null;
		}
		
	}
	
	public static String readAllStreamFromClasspathBaseResource(Class<?> resourceBase, String dataLocation) throws IOException {
		
		if(isFileAvailableOnClasspath(resourceBase, dataLocation)) {
			return readFullStream(resourceBase.getResourceAsStream(dataLocation));
		} else {
			return null;
		}
		
	}
	
	public static List<String> readAllStreamsFromClasspathBaseResource(Class<?> resourceBase, String[] dataLocations) throws IOException {
		
		final List<String> scriptContent = new ArrayList<String>();
		
		for (int i=0;i<dataLocations.length;i++) {
			String content = readAllStreamFromClasspathBaseResource(resourceBase, dataLocations[i]);
			
			if(content != null) {
				scriptContent.add(content);
			}
		}
		
		return scriptContent;
	}
	
	public static String readFullStream(InputStream data) throws IOException {
		
		BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(data, "UTF-8"));
		
		StringBuilder readData = new StringBuilder();
		String readLine;
		
		while((readLine = bufferedReader.readLine()) != null) {
			readData.append(readLine);
		}
		
		return readData.toString();
	}
	
}
