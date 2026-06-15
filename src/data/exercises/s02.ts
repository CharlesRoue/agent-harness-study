import type { ChapterExercises } from '../../types/exercise'

export const s02: ChapterExercises = {
  chapterId: 's02',
  exercises: [
    {
      id: 's02-q1', type: 'quiz', difficulty: '\u57FA\u7840',
      question: '\u5728 Claude API \u4E2D\uFF0C\u6A21\u578B\u8BF7\u6C42\u8C03\u7528\u5DE5\u5177\u65F6\uFF0Cresponse.content \u4E2D\u5305\u542B\u4EC0\u4E48\u7C7B\u578B\u7684 block\uFF1F',
      options: [
        'text block\uFF0C\u5305\u542B\u5DE5\u5177\u8C03\u7528\u6307\u4EE4',
        'tool_use block\uFF0C\u5305\u542B\u5DE5\u5177\u540D\u548C\u8F93\u5165\u53C2\u6570',
        'function block\uFF0C\u5305\u542B\u51FD\u6570\u7B7E\u540D',
        'action block\uFF0C\u5305\u542B\u52A8\u4F5C\u63CF\u8FF0',
      ],
      correctIndex: 1,
      explanation: '\u5F53\u6A21\u578B\u9700\u8981\u8C03\u7528\u5DE5\u5177\u65F6\uFF0Cresponse.content \u4E2D\u5305\u542B type="tool_use" \u7684 block\uFF0C\u5176\u4E2D block.name \u662F\u5DE5\u5177\u540D\uFF0Cblock.input \u662F\u53C2\u6570\uFF0Cblock.id \u662F\u552F\u4E00\u6807\u8BC6\u3002',
    },
    {
      id: 's02-q2', type: 'code_fill', difficulty: '\u57FA\u7840',
      question: '\u8865\u5168\u5DE5\u5177\u5206\u53D1\u903B\u8F91\uFF1A',
      codeBefore: 'for block in response.content:\n    if block.type == "',
      codeAfter: '":\n        output = TOOL_HANDLERS[block.name](**block.input)\n        results.append({"type": "tool_result", ...})',
      answer: 'tool_use',
      explanation: '\u5DE5\u5177\u8C03\u7528\u7684\u5173\u952E\u5224\u65AD\u662F block.type == "tool_use"\u3002\u53EA\u6709\u8FD9\u79CD\u7C7B\u578B\u7684 block \u624D\u8868\u793A\u6A21\u578B\u8981\u8C03\u7528\u5DE5\u5177\u3002',
    },
    {
      id: 's02-q3', type: 'scenario', difficulty: '\u8FDB\u9636',
      scenario: '\u4F60\u7684 Agent \u6709 bash \u548C read_file \u4E24\u4E2A\u5DE5\u5177\u3002\u7528\u6237\u8BF7\u6C42\u201C\u8BFB\u53D6 config.yaml \u7684\u5185\u5BB9\u201D\uFF0C\u4F46\u6A21\u578B\u8C03\u7528\u4E86 bash \u5E76\u6267\u884C cat config.yaml\uFF0C\u800C\u4E0D\u662F read_file\u3002\u6700\u53EF\u80FD\u7684\u539F\u56E0\u662F\uFF1F',
      options: [
        { label: 's02 Tool Use', description: '\u5DE5\u5177\u63CF\u8FF0\uFF08description\uFF09\u4E0D\u591F\u6E05\u6670\uFF0C\u6A21\u578B\u65E0\u6CD5\u533A\u5206\u4F7F\u7528\u573A\u666F' },
        { label: 's10 System Prompt', description: '\u7CFB\u7EDF\u63D0\u793A\u6CA1\u6709\u6B63\u786E\u5F15\u5BFC\u6A21\u578B\u7684\u5DE5\u5177\u9009\u62E9' },
        { label: 's01 Agent Loop', description: '\u5FAA\u73AF\u903B\u8F91\u6709 bug\uFF0C\u8DF3\u8FC7\u4E86 read_file' },
        { label: 's03 Permission', description: 'read_file \u88AB\u6743\u9650\u7CFB\u7EDF\u963B\u6B62\u4E86' },
      ],
      correctIndex: 0,
      explanation: '\u6A21\u578B\u9009\u62E9\u54EA\u4E2A\u5DE5\u5177\u5B8C\u5168\u53D6\u51B3\u4E8E\u5DE5\u5177\u5B9A\u4E49\u4E2D\u7684 name \u548C description\u3002\u597D\u7684\u5DE5\u5177\u63CF\u8FF0\u662F Tool Use \u7684\u5173\u952E\u3002',
    },
  ],
}
