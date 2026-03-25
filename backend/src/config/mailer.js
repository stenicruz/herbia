import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "suporte.plantaapp@gmail.com",
    pass: "rngf njhp qmlh ywax"
  }
});

// Função utilitária para enviar e-mails de qualquer lugar do app
export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: '"Herbia Suporte" <suporte.plantaapp@gmail.com>',
    to,
    subject,
    html // Usamos 'html' em vez de 'text' para o e-mail ficar mais bonito
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Erro detalhado ao enviar e-mail:", error);
    throw error;
  }
};

export default transporter;