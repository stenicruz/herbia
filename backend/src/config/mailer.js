import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];

// O Render vai ler a chave que colaste lá nas variáveis de ambiente
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async (to, subject, html) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  
  // O remetente oficial da tua App
  sendSmtpEmail.sender = { 
    name: "Herbia Suporte", 
    email: "suporte.plantaapp@gmail.com" 
  };
  
  sendSmtpEmail.to = [{ email: to }];

  try {
    console.log(`🚀 [MAILER] Tentando enviar via Brevo para: ${to}`);
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ [MAILER] SUCESSO via Brevo ID:", data.messageId);
    return data;
  } catch (error) {
    console.error("❌ [MAILER] Erro crítico no Brevo:", error.message);
    throw error;
  }
};

export default apiInstance;
