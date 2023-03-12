import React from 'react';
import { Tooltip, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export const TermsOfService = () => {
  return (
    <div className="terms_of_service">
      <Tooltip title="home">
        <Typography.Link href="/">
          <HomeOutlined />
        </Typography.Link>
      </Tooltip>
      <h1>Terms of Service ChatApp</h1>
      <p>
        Welcome to our platform ChatApp! These terms of service ("Terms") govern your use of our
        website and services ("Platform"). By accessing or using the Platform, you agree to be bound
        by these Terms.
      </p>
      <h2>Privacy Policy</h2>
      <p>
        We are committed to protecting your privacy. This privacy policy ("Privacy Policy") explains
        how we collect, use, and disclose your personal information. By using the Platform, you
        consent to the data practices described in this policy.
      </p>
      <h3>Information We Collect</h3>
      <p>
        We collect information about you when you use the Platform. This may include information
        about your device, IP address, location, and browsing activity. We may also collect personal
        information that you provide to us, such as your name, email address, and phone number.
      </p>
      <h3>How We Use Your Information</h3>
      <p>
        We use your information to provide and improve the Platform, to communicate with you, and to
        personalize your experience. We may also use your information to show you targeted ads or to
        comply with legal obligations.
      </p>
      <h3>How We Disclose Your Information</h3>
      <p>
        We may share your information with third-party service providers who help us operate the
        Platform or provide related services. We may also share your information with law
        enforcement or government officials if required by law or if we believe in good faith that
        disclosure is necessary to protect our rights, protect your safety or the safety of others,
        investigate fraud, or respond to a government request.
      </p>
      <h3>Changes to These Terms and Privacy Policy</h3>
      <p>
        We may update these Terms and Privacy Policy from time to time. If we make significant
        changes, we will notify you by email or by posting a notice on the Platform. Your continued
        use of the Platform after any changes indicates your acceptance of the updated Terms and
        Privacy Policy.
      </p>
    </div>
  );
};
