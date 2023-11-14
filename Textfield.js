export default function Textfield() {
  return (
    <div className="p-24">
      <label
        htmlFor="comment"
        className="block text-xl font-medium leading-6 text-gray-900"
      >
        Paste your contract
      </label>
      <div className="mt-2">
        <textarea
          rows={5}
          name="comment"
          id="comment"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg leading-6"
          defaultValue={""}
        />
      </div>
    </div>
  );
}
