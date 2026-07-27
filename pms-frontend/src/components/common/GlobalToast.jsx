import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { clearToast } from '../../redux/slices/uiSlice';

export default function GlobalToast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  return (
    <Snackbar
      open={Boolean(toast)}
      autoHideDuration={4000}
      onClose={() => dispatch(clearToast())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={toast?.severity || 'info'} onClose={() => dispatch(clearToast())} variant="filled">
        {toast?.message}
      </Alert>
    </Snackbar>
  );
}
