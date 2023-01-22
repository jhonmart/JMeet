/* eslint-disable no-console */

import { register } from "register-service-worker";
import { SnackbarProgrammatic as Snackbar } from "buefy";

if (process.env.NODE_ENV !== "development") {
  self.addEventListener("install", () => self.skipWaiting());

  register(`/sw.js`, {
    registrationOptions: {
      ServiceWorkerUpdateViaCache: "imports"
    },
    ready() {},
    registered() {},
    cached() {},
    updatefound() {},
    updated(registration) {
      Snackbar.open({
        message: "Existe novas atualizações, por favor recarregue a página",
        type: "is-warning",
        position: "is-top",
        actionText: "Recarregar",
        duration: 10e3,
        pauseOnHover: true,
        onAction () {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" });
          process.browser && location.reload();
        }
      });
    },
    offline() {},
    error(error) {
      console.error("Error during service worker registration:", error);
    }
  });
}
