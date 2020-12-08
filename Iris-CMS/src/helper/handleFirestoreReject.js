export default function handleFirestoreReject(e, callback) {
  if(e.code) {
    // firebase error
    this.$vs.notify({
      title: e.code,
      text: e.message,
      color: "danger",
      iconPack: "feather",
      icon: "icon-alert-circle",
      position: "bottom-center",
    });
  } else {
    // another unexpected error due to logic failure.
    this.$vs.notify({
      title: 'Unexpected Error!',
      text: e.message,
      color: "danger",
      iconPack: "feather",
      icon: "icon-alert-circle",
      position: "bottom-center",
    });
  }
  console.log(e);
  if (typeof callback == "function") {
    callback();
  }
}