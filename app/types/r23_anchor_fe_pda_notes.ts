export type R23AnchorFePdaNotes = {
  "version": "0.1.0",
  "name": "r23_anchor_fe_pda_notes",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "notesData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "notesName",
          "type": "string"
        },
        {
          "name": "notesImageUrl",
          "type": "string"
        },
        {
          "name": "notesDescription",
          "type": "string"
        }
      ]
    },
    {
      "name": "addNewNote",
      "accounts": [
        {
          "name": "notesData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        },
        {
          "name": "timestamp",
          "type": "i64"
        }
      ]
    },
    {
      "name": "deleteNoteByIndex",
      "accounts": [
        {
          "name": "notesData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateNoteByIndex",
      "accounts": [
        {
          "name": "notesData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u32"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "NotesData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "notesList",
            "type": {
              "vec": {
                "defined": "Note"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Note",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "metadata": {
    "address": "5oHeK4HCbuuUeGkd1jGYJcNPx3o8UTTs5NSTCZaSisgs"
  }
};