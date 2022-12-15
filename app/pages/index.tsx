import { useAnchorWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  AnchorProvider,
  BN,
  Idl,
  Program,
  utils,
  web3,
} from "@project-serum/anchor";
import idl from "@/public/program.json";
import { R23AnchorFePdaNotes } from "@/types/r23_anchor_fe_pda_notes";
import { useEffect, useRef, useState } from "react";

// add this
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

function NoteView({
  initializeNote,
  note,
  wallet,
}: {
  initializeNote: () => void;
  note: any;
  wallet: any;
}) {
  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        Connect Your Wallet First
      </div>
    );
  }
  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <button
          className="p-2 text-white bg-blue-800 rounded-lg"
          onClick={initializeNote}
        >
          Initialize Note
        </button>
      </div>
    );
  }

  console.log(note);

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col gap-2 px-8">
        <div className="flex">
          <div className="flex flex-col flex-1">
            <p className="text-3xl font-bold">{note.name}</p>
            <p className="text-lg">{note.description}</p>
          </div>
          <div className="flex items-center">
            <label
              htmlFor="add-notes-modal"
              className="d-btn d-btn-primary d-btn-sm"
            >
              Add Notes
            </label>
          </div>
        </div>

        <div className="d-divider"></div>

        <input
          type="checkbox"
          id="add-notes-modal"
          className="d-modal-toggle"
        />
        <label htmlFor="add-notes-modal" className="d-modal">
          <div className="d-modal-box">
            <h3 className="text-lg font-bold">Add Notes</h3>

            <div className="flex flex-col gap-2 p-2">
              <input
                type="text"
                className="p-2 border"
                placeholder="Insert Title Here"
              />
              <input
                type="text"
                className="p-2 border"
                placeholder="Insert Content Here"
              />
            </div>
            <div className="d-modal-action">
              <label
                htmlFor="add-notes-modal"
                className="d-btn"
                onClick={() => {
                  alert("clicked");
                }}
              >
                Add Note
              </label>
            </div>
          </div>
        </label>
        <div>
          {note.notesList.map((note: any, i: number) => {
            return (
              <div key={i} className="flex flex-col gap-2">
                <div className="text-lg">{note.title}</div>
                <div className="text-base">{note.content}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const anchorWallet = useAnchorWallet();

  const programRef = useRef<Program<R23AnchorFePdaNotes> | null>(null);
  const [note, setNote] = useState<any>(null);

  async function initProgram() {
    if (!anchorWallet) {
      // recall program after 500ms
      console.log("Wallet not connected, retrying in 500ms");
      // setTimeout(initProgram, 500);
      return;
    }
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "processed",
    });
    const program = new Program(
      idl as Idl,
      idl.metadata.address,
      provider
    ) as unknown as Program<R23AnchorFePdaNotes>;
    programRef.current = program;
    console.log("Done initProgram");
  }

  async function fetchNote() {
    if (!anchorWallet || !programRef.current) {
      console.error("Wallet not connected");
      return null;
    }

    const program = programRef.current;

    try {
      // Calculate the PDA address
      const [pda] = await PublicKey.findProgramAddress(
        [Buffer.from("notes-data-20221214"), anchorWallet.publicKey.toBuffer()],
        program.programId
      );

      let dat_1 = await program.account.notesData.fetch(pda);
      return dat_1;

      // Console log current notes
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function initializeNote() {
    console.log(anchorWallet, programRef.current);
    if (!anchorWallet || !programRef.current) {
      return;
    }

    const program = programRef.current;

    try {
      // Calculate the PDA address
      const [pda] = await PublicKey.findProgramAddress(
        [Buffer.from("notes-data-20221214"), anchorWallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .initialize(
          "My Notes",
          "https://www.google.com/image.jpg",
          "My Notes are here"
        )
        .accounts({
          notesData: pda,
          user: anchorWallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log(await fetchNote());

      // Console log current notes
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    (async () => {
      await initProgram();
      setNote(await fetchNote());
    })();
  }, [anchorWallet]);

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <div className="shadow-md d-navbar bg-base-300">
        <div className="flex-1">
          <a className="text-xl normal-case d-btn d-btn-ghost">Solana Notes</a>
        </div>
        <div className="flex flex-none gap-2 transform scale-75">
          <WalletMultiButtonDynamic />
        </div>
      </div>
      <NoteView
        wallet={anchorWallet}
        initializeNote={initializeNote}
        note={note}
      ></NoteView>
    </div>
  );
}
