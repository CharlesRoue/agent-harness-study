import type { ChapterExercises } from '../../types/exercise'

export const s04: ChapterExercises = {
  chapterId: 's04',
  exercises: [
    {
      id: 's04-q1', type: 'quiz', difficulty: '\u57FA\u7840',
      question: 'Hooks \u7CFB\u7EDF\u5B9A\u4E49\u4E86\u56DB\u4E2A\u6838\u5FC3\u4E8B\u4EF6\uFF0C\u4EE5\u4E0B\u54EA\u4E2A\u4E8B\u4EF6\u5728\u5DE5\u5177\u6267\u884C\u4E4B\u524D\u89E6\u53D1\uFF0C\u53EF\u4EE5\u7528\u4E8E\u6743\u9650\u68C0\u67E5\u548C\u65E5\u5FD7\u8BB0\u5F55\uFF1F',
      options: [
        'UserPromptSubmit',
        'PreToolUse',
        'PostToolUse',
        'Stop',
      ],
      correctIndex: 1,
      explanation: 'PreToolUse \u5728\u5DE5\u5177\u6267\u884C\u4E4B\u524D\u89E6\u53D1\uFF0C\u662F\u6743\u9650\u68C0\u67E5\u548C\u65E5\u5FD7\u8BB0\u5F55\u7684\u7406\u60F3\u4F4D\u7F6E\u3002\u5982\u679C hook \u8FD4\u56DE\u975E None \u503C\uFF0C\u672C\u6B21\u5DE5\u5177\u6267\u884C\u4F1A\u88AB\u963B\u6B62\u3002UserPromptSubmit \u5728\u7528\u6237\u8F93\u5165\u540E\u89E6\u53D1\uFF0CPostToolUse \u5728\u5DE5\u5177\u6267\u884C\u540E\u89E6\u53D1\uFF0CStop \u5728\u5FAA\u73AF\u5373\u5C06\u9000\u51FA\u65F6\u89E6\u53D1\u3002',
    },
    {
      id: 's04-q2', type: 'code_fill', difficulty: '\u57FA\u7840',
      question: '\u8865\u5168 hook \u6CE8\u518C\u903B\u8F91\uFF0C\u5C06\u6743\u9650\u68C0\u67E5\u6302\u5230 PreToolUse \u4E8B\u4EF6\u4E0A\uFF1A',
      codeBefore: 'def permission_hook(block):\n    if block.name == "bash":\n        for pattern in DENY_LIST:\n            if pattern in block.input.get("command", ""):\n                return "Permission denied"\n    return None\n\n',
      codeAfter: '("PreToolUse", permission_hook)',
      answer: 'register_hook',
      explanation: 'register_hook \u662F hook \u7CFB\u7EDF\u7684\u6838\u5FC3\u51FD\u6570\uFF0C\u5B83\u5C06\u56DE\u8C03\u51FD\u6570\u6DFB\u52A0\u5230\u6307\u5B9A\u4E8B\u4EF6\u7684\u5217\u8868\u4E2D\u3002\u5FAA\u73AF\u4E2D\u53EA\u8C03\u7528 trigger_hooks()\uFF0C\u5177\u4F53\u903B\u8F91\u5168\u5728 hook \u56DE\u8C03\u91CC\u3002',
    },
    {
      id: 's04-q3', type: 'scenario', difficulty: '\u8FDB\u9636',
      scenario: '\u4F60\u60F3\u5728\u6BCF\u6B21 bash \u5DE5\u5177\u6267\u884C\u540E\u81EA\u52A8\u8FD0\u884C git add\u3002\u5E94\u8BE5\u628A\u8FD9\u4E2A\u903B\u8F91\u5199\u5728\u54EA\u91CC\uFF1F',
      options: [
        { label: '\u76F4\u63A5\u5199\u5728 agent_loop \u5FAA\u73AF\u4F53\u5185', description: '\u5728\u5DE5\u5177\u6267\u884C\u540E\u7684\u4EE3\u7801\u540E\u9762\u52A0\u4E00\u884C auto_git_add()' },
        { label: '\u5199\u6210 PostToolUse hook', description: '\u6CE8\u518C\u4E00\u4E2A PostToolUse \u56DE\u8C03\uFF0C\u5728\u56DE\u8C03\u4E2D\u68C0\u67E5\u662F\u5426\u662F bash \u5E76\u6267\u884C git add' },
        { label: '\u5199\u5728\u5DE5\u5177\u5B9A\u4E49\u7684 description \u4E2D', description: '\u5728 bash \u5DE5\u5177\u7684 description \u91CC\u544A\u8BC9\u6A21\u578B\u6267\u884C\u540E\u8981 git add' },
        { label: '\u5199\u5728 system prompt \u4E2D', description: '\u5728\u7CFB\u7EDF\u63D0\u793A\u4E2D\u52A0\u4E00\u53E5\u201C\u6BCF\u6B21 bash \u540E\u8981 git add\u201D' },
      ],
      correctIndex: 1,
      explanation: 'Hooks \u7684\u6838\u5FC3\u4EF7\u503C\u5C31\u662F\u201C\u6302\u5728\u5FAA\u73AF\u4E0A\uFF0C\u4E0D\u5199\u8FDB\u5FAA\u73AF\u91CC\u201D\u3002\u81EA\u52A8 git add \u662F\u5DE5\u5177\u6267\u884C\u540E\u7684\u526F\u4F5C\u7528\uFF0C\u5E94\u8BE5\u7528 PostToolUse hook \u5B9E\u73B0\uFF0C\u8FD9\u6837\u5FAA\u73AF\u4F53\u4FDD\u6301\u7A33\u5B9A\uFF0C\u6269\u5C55\u903B\u8F91\u53EF\u4EE5\u72EC\u7ACB\u6DFB\u52A0\u548C\u79FB\u9664\u3002',
    },
  ],
}
