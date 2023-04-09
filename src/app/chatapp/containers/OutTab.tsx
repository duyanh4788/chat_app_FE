import { Button } from 'antd';
import React from 'react';

export const OutTab = () => {
  return (
    <div className="main_form">
      <div className="form_input form_outtab">
        <p style={{ fontWeight: 'bolder', margin: 0 }}>Your have open Chat App into other tab</p>
        <hr style={{ width: '100%', border: '1px solid #00000026' }} />
        <span>please click active to used in to tab</span>
        <Button shape="round" onClick={() => window.location.reload()}>
          active
        </Button>
      </div>
    </div>
  );
};
