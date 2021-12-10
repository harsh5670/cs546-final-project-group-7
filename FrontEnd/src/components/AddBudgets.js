import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useToken from './useToken';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddBudget() {
  const [open, setOpen] = React.useState(false);
  const categories = ['Food and Beverage', 'Groceries','Entertainment','Electronic Devices'];
  const types = ['Monthly', 'Yearly'];
  const { token, setToken } = useToken();
  const [budgetname, setName] = React.useState('');
  const [type, setType] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [category, setCat] = React.useState('');
  const [wallet,setWallet] = React.useState('');
  const [walletdata, setWalletdata] = React.useState([]);
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddBudget = (event) => {
    event.preventDefault();
    let obj = {
      budgetname:budgetname,
      category:category,
      amount:amount,
      wallet:wallet,
      type:type
    }
      axios.post('http://localhost:2000/budget/add', obj,{headers: {
        'Content-Type': 'application/json',
        'token': token
      }}).then(res => {
        console.log(res);
        setOpen(false);
        window.location.reload(false);
      })
    .catch(err => {
      console.log(err)
    })
  }

  const fetchWallet = async () =>{
    try {
        const res = await axios.get('http://localhost:2000/wallet', {headers: {
        'Content-Type': 'application/json',
        'token': token
      }});
      let obj = [];
      res.data.forEach(element => {
        obj.push(element.name);
      });
      setWalletdata(obj);
    } catch (error) {
      console.log(error);
      sessionStorage.removeItem('token');
      window.location.href='/login';
    } 
};
React.useEffect(() => {
  fetchWallet();
},[]);

  return (
    <div>
      <Fab color="primary" onClick={handleClickOpen} aria-label="add" sx={{
        position: "fixed", margin: 0,
        top: "auto",
        right: 40,
        bottom: 40,
        left: "auto"
      }}>
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle>{"Add a New Budget"}</DialogTitle> */}
        <h1>{"Add a New Budget"}</h1>
        <DialogContent>
          <Box sx={{ p: 3, border: '1px solid grey' }}>
            <Stack component="form" noValidate spacing={3}>
              <TextField
                required
                id="budgetname"
                label="Budget Name"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                onChange={handleNameChange}
                sx={{ width: 200 }}
              />
              <TextField
                required
                id="amount"
                label="Amount"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                onChange={handleAmountChange}
                sx={{ width: 200 }}
              />
              <Autocomplete
                disablePortal
                id="wallet"
                options={walletdata}
                value={wallet}
                onChange={(event, newValue) => {
                  setWallet(newValue);
                }}
                sx={{ width: 200 }}
                renderInput={(params) => <TextField {...params} label="Wallet" />}
              />
              <Autocomplete
                disablePortal
                id="category"
                options={categories}
                onChange={(event, newValue) => {
                  setCat(newValue);
                }}
                sx={{ width: 200 }}
                renderInput={(params) => <TextField {...params} label="Category" />}
              />
              <Autocomplete
                disablePortal
                id="type"
                options={types}
                onChange={(event, newValue) => {
                  setType(newValue);
                }}
                sx={{ width: 200 }}
                renderInput={(params) => <TextField {...params} label="Type" />}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddBudget}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}