import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';

import Colors from '../../constants/Colors';

const CustomHeaderButton = props => {
    return <HeaderButton 
        {...props}          
        iconSize={23}
        color='white'
    />
};

export default CustomHeaderButton;