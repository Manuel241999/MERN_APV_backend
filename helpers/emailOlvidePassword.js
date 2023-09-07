import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;
  //Enviar el Email:
  const info = await transporter.sendMail({
    from: "APV - Administrador de Pacientes de Veterinaria",
    to: email,
    subject: "Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `
    <table align="center" class="esd-block-banner" style="position: relative;" esdev-config="h14">
    <tr>
        <td>
            <a target="_blank" href="https://viewstripo.email">
                <img class="w-full" 
                 src="https://oioftq.stripocdn.email/content/guids/CABINET_afa9e4cdc44a36489ab8a25bf18acd36/images/pexelslumn406014removebgpreview.png" alt="Banner Image">
            </a>
        </td>
    </tr>
</table>

<p>Hola ${nombre}, has solicitado reestablecer tu password.</p>
<p>Sigue el siguiente enlace para generar un nuevo password</p>
<p>Para completar el proceso, simplemente haz clic en el siguiente enlace:</p>
<p><a href="${process.env.FRONTEND_URL}/olvide-password/${token}" class="text-blue-500 underline">Reestablecer Password</a></p>

<p>Si no has creado esta cuenta, por favor ignora este mensaje.</p>
</div>
            `,
  });
  console.log("MENSAJE ENVIADO: %s", info.messageId);
};

export default emailOlvidePassword;
