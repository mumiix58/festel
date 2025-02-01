import emailjs from 'emailjs-com';

// EmailJS configuration
const EMAIL_CONFIG = {
  serviceId: 'service_rr4ht3u',  // EmailJS service ID
  templateIds: {
    contact: 'template_g60lad1',  // New contact form template
    booking: 'template_p8czqvd'   // Booking form template
  },
  userId: 'GkoX3Rw1QXFuJol9f'    // EmailJS user ID
};

export const sendEmail = async (templateParams: any, type: 'contact' | 'booking' = 'contact') => {
  try {
    // Initialize EmailJS with user ID
    emailjs.init(EMAIL_CONFIG.userId);

    // Add default recipient email if not provided
    const params = {
      ...templateParams,
      to_email: templateParams.to_email || 'catering@festlmacher.at'
    };

    // Select the appropriate template based on the type
    const templateId = EMAIL_CONFIG.templateIds[type];

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      templateId,
      params
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }

    return response;
  } catch (error: any) {
    console.error('Email sending error:', error);
    
    // Provide a user-friendly error message
    throw new Error(
      'Es gab einen Fehler beim Senden der Nachricht. ' +
      'Bitte kontaktieren Sie uns telefonisch unter +43 (0)699 – 1600 2800.'
    );
  }
};