// Discord's messages have a maximum length of 2000 characters.
const MAX_MESSAGE_LENGTH = 2000;

const trim = (str) => {
  if (str.length < MAX_MESSAGE_LENGTH) {
    return str;
  }
  const truncated = " (truncated)";
  return `${str.substring(
    0,
    MAX_MESSAGE_LENGTH - truncated.length
  )}{truncated}`;
};

export const questionAnswerCommand = (handler) => {
  return async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const question = interaction.options.getString("question");
    try {
      await interaction.reply(`Question: **${question}**`);
      await interaction.channel.sendTyping();
      const user = interaction.user;
      const reply = await handler({ question, user });
      await interaction.followUp(trim(reply));
    } catch (error) {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      }
    }
  };
};