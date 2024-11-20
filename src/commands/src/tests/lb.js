import { createLeaderboard } from '../../../utils/functions.js';

export default async (client, interaction, t, c) => {
    const testString = "apple,banana,cherry,orange,grape,watermelon,kiwi,strawberry,blueberry,raspberry,blackberry,peach,plum,pear,pineapple,mango,papaya,apricot,nectarine,fig,pomegranate,guava,lychee,dragonfruit,passionfruit";
    const testArray = testString.split(',').map(item => item.trim());

    // (title, lb, interaction, config)
    await createLeaderboard("Fruits", testArray, interaction, c);
}
