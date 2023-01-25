use anchor_lang::prelude::*;

declare_id!("5oHeK4HCbuuUeGkd1jGYJcNPx3o8UTTs5NSTCZaSisgs");

#[program]
pub mod r23_anchor_fe_pda_notes {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        notes_name: String,
        notes_image_url: String,
        notes_description: String,
    ) -> Result<()> {
        let sys_notes_data = &mut ctx.accounts.notes_data;
        sys_notes_data.set_inner(NotesData {
            name: notes_name,
            image_url: notes_image_url,
            description: notes_description,
            notes_list: vec![],
            bump: *ctx.bumps.get("notes_data").unwrap(),
        });
        Ok(())
    }

    pub fn add_new_note(
        ctx: Context<ModifyNote>,
        title: String,
        content: String,
        timestamp: i64,
    ) -> Result<()> {
        let sys_notes_data = &mut ctx.accounts.notes_data;
        sys_notes_data.add_new_note(title, content, timestamp);

        Ok(())
    }

    pub fn delete_note_by_index(ctx: Context<ModifyNote>, index: u32) -> Result<()> {
        let sys_notes_data = &mut ctx.accounts.notes_data;
        sys_notes_data.delete_note_by_index(index);

        Ok(())
    }

    pub fn update_note_by_index(
        ctx: Context<ModifyNote>,
        index: u32,
        title: String,
        content: String,
    ) -> Result<()> {
        let sys_notes_data = &mut ctx.accounts.notes_data;
        sys_notes_data.update_note_by_index(index, title, content);

        Ok(())
    }
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Note {
    pub title: String,
    pub content: String,
    pub timestamp: i64,
}

#[account]
pub struct NotesData {
    pub name: String,
    pub image_url: String,
    pub description: String,
    pub notes_list: Vec<Note>,
    pub bump: u8,
}

impl NotesData {
    pub fn add_new_note(&mut self, title: String, content: String, timestamp: i64) {
        self.notes_list.push(Note {
            title,
            content,
            timestamp,
        });
    }

    pub fn delete_note_by_index(&mut self, index: u32) {
        self.notes_list.remove(index as usize);
    }

    pub fn update_note_by_index(&mut self, index: u32, title: String, content: String) {
        self.notes_list[index as usize].title = title;
        self.notes_list[index as usize].content = content;
    }
}

const NOTES_SEED: &[u8] = b"notes-data-20221214";
const NOTES_SIZE: usize = 9000;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=user, space=NOTES_SIZE, seeds=[NOTES_SEED, user.key().as_ref()], bump)]
    pub notes_data: Account<'info, NotesData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ModifyNote<'info> {
    #[account(mut, seeds=[NOTES_SEED, user.key().as_ref()], bump=notes_data.bump)]
    pub notes_data: Account<'info, NotesData>,
    #[account(mut)]
    pub user: Signer<'info>,
}
