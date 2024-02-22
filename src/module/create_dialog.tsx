import { allCostType, getCostTypeDesc, getTagColor } from '../model/type';

import { Component, ComponentChild, ComponentChildren, Ref, type JSX } from 'preact';

import TextField from '@mui/material/TextField';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs';

import CostRecord from '../model/record';

interface CreateDialogProps {
  modifyRecord?: CostRecord;
  onDeleted?: (costRecord: CostRecord) => void;
  onFinished: (costRecord: CostRecord) => void;
}

interface CreateDialogState {
  name?: string;
  price?: string;
  costType?: number;
  spendTime?: number;
  creator?: string;
  createTime: number;
}

class CreateDialog extends Component<CreateDialogProps & DialogProps, CreateDialogState> {
  constructor() {
    super();
  }

  componentDidUpdate(previousProps: Readonly<CreateDialogProps & DialogProps>, previousState: Readonly<CreateDialogState>, snapshot: any): void {
    if (!previousProps.open && this.props.open) {
      if (this.props.modifyRecord != null) {
        const { modifyRecord } = this.props;
        this.setState({
          name: modifyRecord.name,
          price: modifyRecord.price.toString(),
          costType: modifyRecord.costType,
          spendTime: modifyRecord.spendTime,
          creator: modifyRecord.creator,
          createTime: modifyRecord.createTime,
        })
      } else {
        this.setState({
          name: null,
          price: null,
          costType: null,
          spendTime: null,
          creator: null,
          createTime: null,
        });
      }
    }
  }

  handleDelete = () => {
    this.props.onDeleted(this.props.modifyRecord);
    this.props.onClose({}, "backdropClick");
  }

  render(props?: Readonly<CreateDialogProps & DialogProps & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
    return <Dialog
      open={props.open}
      onClose={props.onClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          if (this.props.modifyRecord != null) {
            const updateRecord = CostRecord.clone(this.props.modifyRecord);
            CostRecord.update(updateRecord, formJson);
            props.onFinished(updateRecord)
          } else {
            props.onFinished(CostRecord.create(formJson));
          }
          props.onClose(event, 'backdropClick');
        },
      }}
    >
      <DialogTitle>{this.props.modifyRecord != null ? '修改项目' : '新增项目'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          label="项目名称"
          value={this.state.name}
          fullWidth
          variant="standard"
          onChange={(event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
            this.setState({
              name: (event.target as HTMLInputElement).value,
            });
          }}
        />
        <TextField
          required
          margin="dense"
          id="price"
          name="price"
          label="金额"
          type="number"
          fullWidth
          variant="standard"
          value={this.state?.price}
          inputProps={{
            inputMode: 'decimal',
            step: 0.01,
            startAdornment: <InputAdornment position="start">¥</InputAdornment>,
          }}
          onChange={(event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
            this.setState({
              price: (event.target as HTMLInputElement).value,
            });
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{
              textField: {
                inputProps: {
                  "name": "spendTime"
                }
              }
            }}
            className='create_dialog_date_picker'
            sx={{ width: '100%', height: '48px', marginTop: '8px' }}
            defaultValue={dayjs(this.state?.spendTime ?? Date.now())}
          />
        </LocalizationProvider>
        <TextField
          id="costType"
          select
          name="costType"
          label="开销类型"
          margin="dense"
          fullWidth
          className="create_dialog_cost_type_selector"
          defaultValue={this.state?.costType ?? allCostType[0]}
        >
          {allCostType.map((option) => (
            <MenuItem key={option} value={option}>
              <div className="flex-cnt">
                <div className={"cost-type-tag" + " " + "cost-type-tag_" + getTagColor(option)}>
                  <span>{getCostTypeDesc(option)}</span>
                </div>
              </div>
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        {
          this.props.modifyRecord != null && <>
            <Button color="error" onClick={this.handleDelete} >删除</Button>
            <div style={{ flex: '1 0 0' }} />
          </>
        }
        <Button onClick={props.onClose}>取消</Button>
        <Button type="submit">{this.props.modifyRecord != null ? "更新" : "添加"}</Button>
      </DialogActions>
    </Dialog>
  };
}

export default CreateDialog;