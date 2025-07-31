import OpenAI from "openai";
import express from 'express';
import multer from 'multer';
import { config } from 'dotenv';
import supabase from '../supabase.js';

config();

const router = express.Router();
const openai = new OpenAI();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/message', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { data: userFiles, error: filesError } = await supabase
      .from('filesData')
      .select('*')
      .eq('userID', req.locals.user.sub);

    if (filesError) {
      console.error('Error fetching user files:', filesError);
      return res.status(500).json({ error: 'Failed to fetch user files' });
    }

    console.log("userFiles", userFiles);

    let allFileContent = '';
    for (const file of userFiles || []) {
      try {
        const { data: fileContent, error: downloadError } = await supabase.storage
          .from('files-for-vector')
          .download(file.supabase_path);

        if (downloadError) {
          console.error(`Error downloading file ${file.filename}:`, downloadError);
          continue;
        }

        const fileText = await fileContent.text();
        console.log(`File content for ${file.filename}:`, fileText);

        allFileContent += `\n\n--- FILE: ${file.filename} ---\n${fileText}\n--- END FILE ---\n`;
      } catch (error) {
        console.error(`Error processing file ${file.filename}:`, error);
      }
    }

    const messages = [
      {
        role: "system",
        content: `You are a helpful AI assistant. Use the following information to answer customer questions:
        

${allFileContent}

Please provide accurate and helpful responses based on the information provided above. If the information is not available in the provided files, please let the customer know that you don't have that specific information.
Always format your responses using proper markdown. Use headers, lists, and emphasis appropriately. Keep paragraphs under 3 sentences.`
      },
      ...chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: "user",
        content: message
      }
    ];

    console.log("File Content", allFileContent)
    //ft:gpt-4.1-nano-2025-04-14:personal:customerdata:BkFPKzdQ
    //gpt-4.1-2025-04-14
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-2025-04-14",
      messages: messages,
      temperature: 0.7
    });

    console.log("completion", completion.choices[0].message);

    console.log("completion", completion.choices[0].message)

    const updatedChatHistory = [...chatHistory,
    { sender: 'user', text: message, timestamp: new Date().toISOString() },
    { sender: 'ai', text: completion.choices[0].message.content, timestamp: new Date().toISOString() }
    ];

    const { data: existingRecord, error: checkError } = await supabase
      .from('ChatHistory')
      .select('id')
      .eq('userID', req.locals.user.sub)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking ChatHistory record:', checkError);
    } else if (existingRecord) {
      const { error: updateError } = await supabase
        .from('ChatHistory')
        .update({
          ChatHistory: updatedChatHistory
        })
        .eq('userID', req.locals.user.sub);

      if (updateError) {
        console.error('Error updating ChatHistory:', updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('ChatHistory')
        .insert({
          id: parseInt(req.locals.user.sub) || Date.now(),
          created_at: new Date().toISOString(),
          ChatHistory: updatedChatHistory,
          userID: req.locals.user.sub
        });

      if (insertError) {
        console.error('Error inserting ChatHistory:', insertError);
      }
    }

    res.json({
      response: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('Error in message route:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

router.delete('/delete-chat', async (req, res) => {
  try {
    console.log("userID", req.locals.user)
    const userID = req.locals.user.sub;
    

    if (!userID) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { error } = await supabase
      .from('ChatHistory')
      .delete()
      .eq('userID', userID);

    if (error) {
      console.error('Error deleting ChatHistory:', error);
      return res.status(500).json({ error: 'Failed to delete chat history' });
    }

    res.status(200).json({
      message: 'Chat history deleted successfully'
    });

  } catch (error) {
    console.error('Error in delete chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

router.get('/get-chat', async (req, res) => {
  try {
    const userID = req.locals.user.sub;

    if (!userID) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { data, error } = await supabase
      .from('ChatHistory')
      .select('ChatHistory')
      .eq('userID', userID)
      .maybeSingle();

    if (error) {
      console.error('Error fetching ChatHistory:', error);
      return res.status(500).json({ error: 'Failed to fetch chat history' });
    }

    const chatHistory = data?.ChatHistory || [];

    res.status(200).json({
      chatHistory: chatHistory
    });

  } catch (error) {
    console.error('Error in get-chat route:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

router.post('/upload-to-vector', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log("req.locals.user", req.locals.user)

    const uploadedFiles = [];
    
    for (const file of req.files) {
      try {
        const filePath = `uploads/${Date.now()}-${file.originalname}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('files-for-vector')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (uploadError) {
          console.error(`Error uploading ${file.originalname} to bucket:`, uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('files-for-vector')
          .getPublicUrl(filePath);

        const { data: fileRecord, error: insertError } = await supabase
          .from('filesData')
          .insert({
            supabase_bucket_id: uploadData.id,
            supabase_path: filePath,
            userID: req.locals.user.sub,
            filename: file.originalname,
            file_size: file.size,
            mime_type: file.mimetype,
            public_url: urlData.publicUrl,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error(`Error creating file record for ${file.originalname}:`, insertError);
          continue;
        }

        uploadedFiles.push({
          file: fileRecord,
          uploadData: uploadData
        });

        console.log(`Successfully uploaded ${file.originalname} to bucket and database`);

      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
      }
    }

    console.log("Files uploaded to Supabase bucket successfully");

    res.status(200).json({
      message: 'Files uploaded to Supabase bucket successfully',
      uploadedFiles: uploadedFiles
    });

  } catch (error) {
    console.error('Error in upload-to-vector route:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

router.get('/get-files', async (req, res) => {
  try {
    console.log("req.locals.user", req.locals.user)
    
    const { data: userFiles, error } = await supabase
      .from('filesData')
      .select('*')
      .eq('userID', req.locals.user.sub);

    if (error) {
      throw error;
    }

    console.log("userFiles", userFiles)

    res.status(200).json({
      data: userFiles
    });

  } catch (error) {
    console.error('Error in get files:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

router.get('/download-file/:file_id', async (req, res) => {
  try {
    const { file_id } = req.params;

    const { data: fileData, error: fetchError } = await supabase
      .from('filesData')
      .select('*')
      .eq('id', file_id)
      .eq('userID', req.locals.user.sub)
      .single();

    if (fetchError || !fileData) {
      return res.status(404).json({ error: 'File not found' });
    }

    const { data: fileBuffer, error: downloadError } = await supabase.storage
      .from('files-for-vector')
      .download(fileData.supabase_path);

    if (downloadError) {
      console.error('Error downloading file from bucket:', downloadError);
      return res.status(500).json({ error: 'Failed to download file from storage' });
    }

    const arrayBuffer = await fileBuffer.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', fileData.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);

  } catch (error) {
    console.error('Error in download file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

router.delete('/delete-file/:file_id', async (req, res) => {
  try {
    const { file_id } = req.params;
    console.log("file_id", file_id)

    const { data: fileData, error: fetchError } = await supabase
      .from('filesData')
      .select('*')
      .eq('id', file_id)
      .eq('userID', req.locals.user.sub)
      .single();

    if (fetchError || !fileData) {
      return res.status(404).json({ error: 'File not found' });
    }

    const { error: deleteError } = await supabase.storage
      .from('files-for-vector')
      .remove([fileData.supabase_path]);

    if (deleteError) {
      console.error('Error deleting file from bucket:', deleteError);
      return res.status(500).json({ error: 'Failed to delete file from bucket' });
    }

    const { error: dbDeleteError } = await supabase
      .from('filesData')
      .delete()
      .eq('id', file_id)
      .eq('userID', req.locals.user.sub);

    if (dbDeleteError) {
      console.error('Error deleting file record:', dbDeleteError);
      return res.status(500).json({ error: 'Failed to delete file record' });
    }

    res.status(200).json({
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Error in delete file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;


