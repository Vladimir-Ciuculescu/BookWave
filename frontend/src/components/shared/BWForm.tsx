import { Formik, FormikHelpers } from "formik";
import React, { ReactNode } from "react";

interface BWFormProps {
  initialValues: Object;

  children: ReactNode;
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void;
  validationSchema: any;
  innerRef?: any;
}

const BWForm: React.FC<BWFormProps> = ({
  initialValues,
  onSubmit,
  children,
  validationSchema,
  innerRef,
}) => {
  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {children}
    </Formik>
  );
};

export default BWForm;
