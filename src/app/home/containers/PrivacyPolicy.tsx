import React from 'react';
import { Tooltip, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

export const PrivacyPolicy = () => {
  return (
    <div className="main_form">
      <div className="terms_of_service">
        <Tooltip title="home">
          <Typography.Link href="/">
            <HomeOutlined />
          </Typography.Link>
        </Tooltip>
        <h1>Information Collection and Use</h1>
        <p>
          We collect several different types of information for various purposes to provide and
          improve our Service to you.
        </p>
        <h2>Types of Data Collected</h2>
        <p>
          Personal Data While using our Service, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or identify you ("Personal
          Data"). Personally identifiable information may include, but is not limited to: Email
          address First name and last name Phone number Address, State, Province, ZIP/Postal code,
          City Cookies and Usage Data Usage Data We may also collect information that your browser
          sends whenever you visit our Service or when you access the Service by or through a mobile
          device ("Usage Data"). This Usage Data may include information such as your computer's
          Internet Protocol address (e.g. IP address), browser type, browser version, the pages of
          our Service that you visit, the time and date of your visit, the time spent on those
          pages, unique device identifiers and other diagnostic data. When you access the Service
          with a mobile device, this Usage Data may include information such as the type of mobile
          device you use, your mobile device unique ID, the IP address of your mobile device, your
          mobile operating system, the type of mobile Internet browser you use, unique device
          identifiers and other diagnostic data. Tracking & Cookies Data We use cookies and similar
          tracking technologies to track the activity on our Service and we hold certain
          information. Cookies are files with small amount of data which may include an anonymous
          unique identifier. Cookies are sent to your browser from a website and stored on your
          device. Tracking technologies also used are beacons, tags, and scripts to collect and
          track information and to improve and analyze our Service. You can instruct your browser to
          refuse all cookies or to indicate when a cookie is being sent. However, if you do not
          accept cookies, you may not be able to use some portions of our Service. Examples of
          Cookies we use: Session Cookies. We use Session Cookies to operate our Service. Preference
          Cookies. We use Preference Cookies to remember your preferences and various settings.
          Security Cookies. We use Security Cookies for security purposes.
        </p>
        <h3>Use of Data</h3>
        <p>
          We collect information about you when you use the Platform. This may include information
          about your device, IP address, location, and browsing activity. We may also collect
          personal information that you provide to us, such as your name, email address, and phone
          number.
        </p>
        <h3>How We Use Your Information</h3>
        <p>
          We use the collected data for various purposes: To provide and maintain the Service To
          notify you about changes to our Service To allow you to participate in interactive
          features of our Service when you choose to do so To provide customer care and support To
          provide analysis or valuable information so that we can improve the Service To monitor the
          usage of the Service To detect, prevent and address technical issues
        </p>
        <h3>Transfer of Data</h3>
        <p>
          Your information, including Personal Data, may be transferred to — and maintained on —
          computers located outside of your state, province, country or other governmental
          jurisdiction where the data protection laws may differ than those from your jurisdiction.
          If you are located outside [Country name] and choose to provide information to us, please
          note that we transfer the data, including
        </p>
      </div>
    </div>
  );
};
