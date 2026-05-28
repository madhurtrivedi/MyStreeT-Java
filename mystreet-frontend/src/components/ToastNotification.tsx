import { Alert, Slide, SlideProps, Snackbar } from "@mui/material";

const SlideTransition = (props: SlideProps) => <Slide {...props} direction="left" />;

interface ToastNotificationProps {
  open: boolean;
  message: string;
  severity?: "success" | "info" | "warning" | "error";
  onClose: () => void;
}

export default function ToastNotification({
  open,
  message,
  severity = "success",
  onClose,
}: ToastNotificationProps) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={4000}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ mt: 8 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          bgcolor: severity === "success" ? "#d4f9d8" : undefined,
          color: severity === "success" ? "#1f5f20" : undefined,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
