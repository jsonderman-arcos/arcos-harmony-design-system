import type { Components } from '@mui/material/styles';
import type { TextFieldProps } from '@mui/material';

export const MuiTextField: Components['MuiTextField'] = {
  defaultProps: {
    variant: 'outlined' as TextFieldProps['variant'],
  },
};