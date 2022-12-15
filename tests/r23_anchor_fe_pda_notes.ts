import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { R23AnchorFePdaNotes } from "../target/types/r23_anchor_fe_pda_notes";

describe("r23_anchor_fe_pda_notes", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .R23AnchorFePdaNotes as Program<R23AnchorFePdaNotes>;

  const utils = {
    derivePageVisitsPda: (userPubkey: anchor.web3.PublicKey) => {
      return anchor.web3.PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("notes-data-20221214"),
          userPubkey.toBuffer(),
        ],
        program.programId
      )[0];
    },
  };

  const otherUser_1_Wallet = new anchor.Wallet(anchor.web3.Keypair.generate());

  // airdrop some solana to wallets
  before(async () => {
    // airdrop some solana
    await program.provider.connection.confirmTransaction(
      await program.provider.connection.requestAirdrop(
        otherUser_1_Wallet.publicKey,
        10000000000
      ),
      "confirmed"
    );
  });

  const user_1NotesPDA = utils.derivePageVisitsPda(
    otherUser_1_Wallet.publicKey
  );

  it("Is initialized!", async () => {
    await program.methods
      .initialize(
        "My Notes",
        "https://www.google.com/image.jpg",
        "My Notes are here"
      )
      .accounts({
        notesData: user_1NotesPDA,
        user: otherUser_1_Wallet.publicKey,
      })
      .signers([otherUser_1_Wallet.payer])
      .rpc();

    // get the data
    let dat_1 = await program.account.notesData.fetch(user_1NotesPDA);
    console.log(dat_1);
  });

  it("Can add new note", async () => {
    await program.methods
      .addNewNote("My Notes", "Hello World!", new anchor.BN(0))
      .accounts({
        notesData: user_1NotesPDA,
        user: otherUser_1_Wallet.publicKey,
      })
      .signers([otherUser_1_Wallet.payer])
      .rpc();

    // get the data
    let dat_1 = await program.account.notesData.fetch(user_1NotesPDA);
    console.log(dat_1);

    await program.methods
      .addNewNote(
        "Another Note!",
        "Another message to see if you can accept this!",
        new anchor.BN(0)
      )
      .accounts({
        notesData: user_1NotesPDA,
        user: otherUser_1_Wallet.publicKey,
      })
      .signers([otherUser_1_Wallet.payer])
      .rpc();

    // get the data
    let dat_2 = await program.account.notesData.fetch(user_1NotesPDA);
    console.log(dat_2);
  });

  it("Can delete a note", async () => {
    await program.methods
      .deleteNoteByIndex(0)
      .accounts({
        notesData: user_1NotesPDA,
        user: otherUser_1_Wallet.publicKey,
      })
      .signers([otherUser_1_Wallet.payer])
      .rpc();

    // get the data
    let dat_1 = await program.account.notesData.fetch(user_1NotesPDA);
    console.log(dat_1);
  });

  it("Can update a note", async () => {
    await program.methods
      .updateNoteByIndex(0, "Updated Note", "Updated Message")
      .accounts({
        notesData: user_1NotesPDA,
        user: otherUser_1_Wallet.publicKey,
      })
      .signers([otherUser_1_Wallet.payer])
      .rpc();

    // get the data
    let dat_1 = await program.account.notesData.fetch(user_1NotesPDA);
    console.log(dat_1);
  });
});
