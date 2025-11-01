import PreferencesForm from "../PreferencesForm";

export default function PreferencesFormExample() {
  return (
    <div className="max-w-md p-6">
      <PreferencesForm
        onSubmit={(preferences) => console.log("Preferences saved:", preferences)}
      />
    </div>
  );
}
