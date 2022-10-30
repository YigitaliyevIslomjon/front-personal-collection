export type TopicList = Topic[];

export type Topic = {
  topic_name: string;
  _id: string;
};

export type TopicForm = {
  topic_name: string;
};

export type EditTopicModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  topicTableRowData: Topic;
  getTopicTableData: (a: number, b: number) => void;
};

export type CreateTopicModalProp = {
  setVisible: (value: boolean) => void;
  visible: boolean;
  getTopicTableData: (a: number, b: number) => void;
};
