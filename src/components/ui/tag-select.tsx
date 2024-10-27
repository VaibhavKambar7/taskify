import React from "react";
import Select from "react-select";
import type { ActionMeta, MultiValue } from "react-select";

type Tag = {
  value: string;
  label: string;
};

const TAGS: Tag[] = [
  { value: "today", label: "Today" },
  { value: "urgent", label: "Urgent" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

interface TaskTagsMultiSelectProps {
  selectedTags: string[];
  onChange: (newTags: string[]) => void;
}

function TaskTagsMultiSelect({
  selectedTags,
  onChange,
}: TaskTagsMultiSelectProps) {
  const selectedTagObjects = React.useMemo(
    () => TAGS.filter((tag) => selectedTags.includes(tag.value)),
    [selectedTags]
  );

  const handleChange = (
    newValue: MultiValue<Tag>,
    actionMeta: ActionMeta<Tag>
  ) => {
    const newTags = newValue.map((tag) => tag.value);
    onChange(newTags);
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "white",
      borderColor: "rgb(209 213 219)",
      "&:hover": {
        borderColor: "rgb(156 163 175)",
      },
      minHeight: "42px",
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "rgb(219 234 254)",
      borderRadius: "9999px",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "rgb(30 64 175)",
      fontSize: "0.75rem",
      padding: "2px 8px",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "rgb(30 64 175)",
      ":hover": {
        backgroundColor: "rgb(191 219 254)",
        color: "rgb(30 64 175)",
      },
      borderRadius: "0 9999px 9999px 0",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "rgb(156 163 175)",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "white",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      border: "1px solid rgb(229 231 235)",
    }),
    option: (
      base: any,
      state: { isFocused: boolean; isSelected: boolean }
    ) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "rgb(219 234 254)"
        : state.isSelected
        ? "rgb(191 219 254)"
        : "white",
      color: "rgb(31 41 55)",
      ":active": {
        backgroundColor: "rgb(191 219 254)",
      },
    }),
  };

  return (
    <Select
      isMulti
      name="tags"
      options={TAGS}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Select tags..."
      value={selectedTagObjects}
      onChange={handleChange}
      styles={customStyles}
      noOptionsMessage={() => "No more tags available"}
    />
  );
}

export default TaskTagsMultiSelect;
