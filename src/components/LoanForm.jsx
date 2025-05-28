import { useState, useEffect } from "react";
import "./LoanForm.css";

// ---------------------------- Import yup och yupResolver ----------------------------
/* import { yupResolver } from "@hookform/resolvers/yup"; */
import * as yup from "yup";
// ----------------------------

import { loanSchema } from "./loanValidationSchema";

const LoanForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    employed: false,
    salary: "",
    loanAmount: "",
    loanPurpose: "",
    repaymentYears: "",
    comments: "",
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);  // <-- Loading state

  useEffect(() => {
    const savedData = localStorage.getItem("loanFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("loanFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---------------------------- Funktion för att validera med yup per steg ----------------------------
  const validateStepWithYup = async (currentStep) => {
    let schema;
    if (currentStep === 1) {
      schema = yup.object().shape({
        name: loanSchema.fields.name,
        phone: loanSchema.fields.phone,
        age: loanSchema.fields.age,
      });
    } else if (currentStep === 2) {
      schema = yup.object().shape({
        salary: loanSchema.fields.salary,
        loanAmount: loanSchema.fields.loanAmount,
      });
    } else if (currentStep === 3) {
      schema = yup.object().shape({
        loanPurpose: loanSchema.fields.loanPurpose,
        repaymentYears: loanSchema.fields.repaymentYears,
        comments: loanSchema.fields.comments,
      });
    }

    try {
      await schema.validate(formData, { abortEarly: false });
      return {};
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      return newErrors;
    }
  };
  // ----------------------------

  const handleNext = async (e) => {
    e.preventDefault();
    const newErrors = await validateStepWithYup(step);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const errorMessages = Object.values(newErrors).join("\n");
      alert(`Vänligen rätta följande fel:\n${errorMessages}`);
      return;
    }
    setErrors({});
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = await validateStepWithYup(step);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const errorMessages = Object.values(newErrors).join("\n");
      alert(`Vänligen rätta följande fel:\n${errorMessages}`);
      return;
    }
    setErrors({});
    setLoading(true); // STARTA loading

    setTimeout(() => {
      console.log("Ansökan:", formData);
      localStorage.removeItem("loanFormData");
      setLoading(false); // STOPPA loading
      setSubmitted(true); // Markera som skickad
    }, 2000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="p-4 rounded shadow form-container">
        {submitted ? (
          <h2 className="text-center text-white">Tack för din ansökan!</h2>
        ) : (
          <>
            <h2 className="text-center text-white mb-5">
              Låneansökan - Steg {step} av 3
            </h2>
            <form>
              {step === 1 && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-black">Namn</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      aria-label="Namn"
                    />
                    {errors.name && (
                      <div className="text-danger mt-1">{errors.name}</div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label text-black">
                      Telefonnummer
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      aria-label="Telefonnummer"
                    />
                    {errors.phone && (
                      <div className="text-danger mt-1">{errors.phone}</div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label text-black">Ålder</label>
                    <input
                      type="number"
                      className="form-control"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      aria-label="Ålder"
                    />
                    {errors.age && (
                      <div className="text-danger mt-1">{errors.age}</div>
                    )}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="row g-3">
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="employed"
                        checked={formData.employed}
                        onChange={handleChange}
                        id="employed"
                      />
                      <label
                        className="form-check-label text-black"
                        htmlFor="employed"
                      >
                        Är du anställd?
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-black">Din lön</label>
                    <select
                      className="form-select"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      required
                      aria-label="Löneintervall"
                    >
                      <option value="">Välj löneintervall</option>
                      <option value="<500">Mindre än $500</option>
                      <option value="500-1000">$500 - $1000</option>
                      <option value="1000-2000">$1000 - $2000</option>
                      <option value=">2000">Över $2000</option>
                    </select>
                    {errors.salary && (
                      <div className="text-danger mt-1">{errors.salary}</div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label text-black">Lånebelopp</label>
                    <input
                      type="number"
                      className="form-control"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleChange}
                      required
                      aria-label="Lånebelopp"
                    />
                    {errors.loanAmount && (
                      <div className="text-danger mt-1">
                        {errors.loanAmount}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-black">
                      Syftet med lånet
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="loanPurpose"
                      value={formData.loanPurpose}
                      onChange={handleChange}
                      required
                      aria-label="Syftet med lånet"
                    />
                    {errors.loanPurpose && (
                      <div className="text-danger mt-1">
                        {errors.loanPurpose}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label text-black">
                      Återbetalningstid i år
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="repaymentYears"
                      value={formData.repaymentYears}
                      onChange={handleChange}
                      required
                      aria-label="Återbetalningstid"
                    />
                    {errors.repaymentYears && (
                      <div className="text-danger mt-1">
                        {errors.repaymentYears}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label text-black">Kommentarer</label>
                    <textarea
                      className="form-control"
                      name="comments"
                      rows="3"
                      value={formData.comments}
                      onChange={handleChange}
                      aria-label="Kommentarer"
                    ></textarea>
                  </div>
                </div>
              )}
              <div className="row g-3 mt-3">
                <div className="col-12 d-flex justify-content-between">
                  {step > 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleBack}
                      aria-label="Gå tillbaka till föregående steg"
                      disabled={loading}  // disable under loading
                    >
                      Tillbaka
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      className="btn btn-primary ms-auto"
                      onClick={handleNext}
                      aria-label="Gå till nästa steg"
                      disabled={loading}  // disable under loading
                    >
                      Nästa
                    </button>
                  ) : loading ? (
                    <div className="loading-spinner ms-auto">Skickar...</div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary ms-auto"
                      onClick={handleSubmit}
                      aria-label="Skicka formuläret"
                    >
                      Skicka
                    </button>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoanForm;
