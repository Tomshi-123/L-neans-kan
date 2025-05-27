import * as Yup from "yup";

export const loanSchema = Yup.object().shape({
  name: Yup.string().required("Namn är obligatoriskt."),
  phone: Yup.string().required("Telefonnummer är obligatoriskt."),
  age: Yup.number().required("Ålder krävs").min(18, "Du måste vara minst 18 år."),
  salary: Yup.string().required("Lön är obligatorisk.").min(500, "Minsta lön är $500."),
  loanAmount: Yup.number().required("Lånebelopp krävs").min(1),
  loanPurpose: Yup.string().required("Syftet med lånet är obligatoriskt."),
  repaymentYears: Yup.number().required("Återbetalningstid krävs").min(1),
});
