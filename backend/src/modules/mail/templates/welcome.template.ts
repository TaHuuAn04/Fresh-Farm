export const otpEmailTemplate = (name: string, code: string): string => {
  return `
    <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP Xác Nhận</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 10px 0;
            color: #4caf50;
          }
          .content {
            margin: 20px 0;
            line-height: 1.6;
          }
          .footer {
            text-align: center;
            padding: 10px 0;
            color: #999;
            font-size: 12px;
          }
          .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #4caf50;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Chào mừng, ${name}!</h1>
          </div>
          <div class="content">
            <p>Xin chào ${name},</p>
            <p>Chúng tôi đã nhận được yêu cầu xác thực từ bạn. Để tiếp tục, vui lòng nhập mã OTP bên dưới:</p>
            <div class="otp-code">
              Mã OTP của bạn là:
              <strong>${code}</strong>
            </div>
            <p>Mã OTP này có hiệu lực trong vòng 10 phút. Nếu bạn không yêu cầu mã OTP này, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,<br />Đội ngũ hỗ trợ khách hàng</p>
          </div>
          <div class="footer">
            <p>Email này được gửi tự động. Vui lòng không trả lời trực tiếp.</p>
            <p><a href="mailto:support@example.com" style="color: #4CAF50; text-decoration: none;">Liên hệ hỗ trợ</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};
