// src/tokens/scripts/generateMuiOverrides.ts
import type { Theme, Components } from '@mui/material/styles';
import { MuiButton } from './overrides/Button';
import { MuiCheckbox } from './overrides/Checkbox';
import { MuiRadio} from './overrides/Radio';
import {MuiSelect} from './overrides/Select';
import {MuiOutlinedInput} from './overrides/OutlinedInput';
import {MuiFormLabel} from './overrides/FormLabel';
import {MuiFormHelperText} from './overrides/FormHelperText';
import {MuiTextField} from './overrides/TextField';
import {MuiChip} from './overrides/Chip';
//import {MuiTableHead} from './overrides/TableHead';
//import {MuiTableCell} from './overrides/TableCell';
//import {MuiTableRow} from './overrides/TableRow';
import {MuiCard} from './overrides/Card';
import {MuiPaper} from './overrides/Paper';
//import {MuiMenu} from './overrides/Menu';
//import {MuiMenuItem} from './overrides/MenuItem';
import {MuiTabs} from './overrides/Tabs';
import {MuiTab} from './overrides/Tab';
import { token, tokenNumber, t } from './lib/tokenUtils';


/** Build `theme.components` overrides */
export function buildComponentOverrides(theme: Theme): Components {
  const components: Components = {
    MuiButton: MuiButton,
    MuiCheckbox: MuiCheckbox,
    MuiRadio: MuiRadio,
    MuiSelect: MuiSelect,
    MuiOutlinedInput: MuiOutlinedInput,
    MuiFormLabel: MuiFormLabel,
    MuiFormHelperText: MuiFormHelperText,
    MuiTextField: MuiTextField,
    MuiChip: MuiChip,
    MuiCard: MuiCard,
    MuiPaper: MuiPaper,
    MuiTabs: MuiTabs,
    MuiTab: MuiTab,
  };
  return components;
}
