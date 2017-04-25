package br.gov.serpro.supde.infra.batch.support;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;
import javax.validation.ReportAsSingleViolation;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Documented
@NotNull
@Size(min=1)
@ReportAsSingleViolation
@Constraint(validatedBy = MyNotEmpty.NotEmptyValidator.class)
@Target({ ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNotEmpty {
    String message() default "{com.acme.constraint.NotEmpty.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    @Target({ ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER })
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    @interface List {
        MyNotEmpty[] value();
    }    

    class NotEmptyValidator implements ConstraintValidator<MyNotEmpty, String> {
        public void initialize(MyNotEmpty constraintAnnotation) {}

        public boolean isValid(String value, ConstraintValidatorContext context) {
            return true;
        }
    }
}