import React from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import { FOREGROUND_COLOR } from './MarkdownEditor';
import Formats from './Formats';

const defaultStyles = { padding: 8, color: FOREGROUND_COLOR, fontSize: 16 };

const defaultMarkdownButton = ({ item, getState, setState }) => {
  return (
    <TouchableOpacity onPress={() => item.onPress({ getState, setState, item })}>
      <Text style={[defaultStyles, item.style]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export const renderFormatButtons = ({ getState, setState }, formats, markdownButton) => {
  const list = (
    <FlatList
      data={formats ? formats : Formats}
      keyboardShouldPersistTaps="always"
      renderItem={({ item, index }) =>
        markdownButton
          ? markdownButton({ item, getState, setState })
          : defaultMarkdownButton({ item, getState, setState })}
      horizontal
    />
  );
  return list;
};
