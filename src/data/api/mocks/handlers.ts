import { rest, RestHandler } from "msw";

import { ENDPOINTS } from "../index";

// replace all whitespace characters including newlines before opening tags
// this allows writing human readable mock data while still parsing as expected
const xml = (xmlString: string): string => xmlString.replace(/\s+</g, "<");

const successfulGetHandler = (
  endpoint: string,
  mockData: string,
): RestHandler =>
  rest.get(endpoint, (req, res, ctx) =>
    res(ctx.status(200), ctx.xml(xml(mockData))),
  );

const cardsRequestHandler: RestHandler = successfulGetHandler(
  ENDPOINTS.CARDS,
  `<root>
    <unit>
      <id>10076</id>
      <name>Stewie</name>
      <desc>What the deuce?! Damn you all! Ha ha, classic. Stewie here. We're gonna have fun together.</desc>
      <character>fg_stewie</character>
      <picture>FG_LMStewie</picture>
      <asset_bundle>49</asset_bundle>
      <release_time>1563127200</release_time>
      <attack>6</attack>
      <health>30</health>
      <rarity>4</rarity>
      <skill id="barrierall" x="1"/>
      <skill id="strike" x="2"/>
      <skill id="leech" x="4"/>
      <type>1</type>
      <set>2</set>
      <upgrade>
        <level>2</level>
        <health>31</health>
        <skill id="barrierall" x="1"/>
        <skill id="strike" x="3"/>
        <skill id="leech" x="4"/>
      </upgrade>
      <upgrade>
        <level>3</level>
        <health>33</health>
        <skill id="barrierall" x="1"/>
        <skill id="strike" x="3"/>
        <skill id="leech" x="5"/>
      </upgrade>
      <upgrade>
        <level>4</level>
        <health>34</health>
        <attack>7</attack>
      </upgrade>
      <upgrade>
        <level>5</level>
        <health>36</health>
        <skill id="barrierall" x="1"/>
        <skill id="strike" x="3"/>
        <skill id="leech" x="6"/>
      </upgrade>
      <upgrade>
        <level>6</level>
        <health>38</health>
        <attack>8</attack>
        <skill id="barrierall" x="1"/>
        <skill id="strike" x="4"/>
        <skill id="leech" x="6"/>
      </upgrade>
      <upgrade>
        <level>7</level>
        <health>39</health>
        <skill id="barrierall" x="1"/>
        <skill id="strike" x="4"/>
        <skill id="leech" x="7"/>
      </upgrade>
      <upgrade>
        <level>8</level>
        <health>41</health>
        <skill id="barrierall" x="2"/>
        <skill id="strike" x="4"/>
        <skill id="leech" x="7"/>
      </upgrade>
      <upgrade>
      <level>9</level>
        <health>43</health>
        <skill id="barrierall" x="2"/>
        <skill id="strike" x="5"/>
        <skill id="leech" x="7"/>
      </upgrade>
      <upgrade>
        <level>10</level>
        <health>44</health>
        <attack>9</attack>
        <skill id="barrierall" x="2"/>
        <skill id="strike" x="5"/>
        <skill id="leech" x="8"/>
      </upgrade>
      <upgrade>
        <level>11</level>
        <health>46</health>
        <skill id="barrierall" x="2"/>
        <skill id="strike" x="5"/>
        <skill id="leech" x="9"/>
      </upgrade>
      <upgrade>
        <level>12</level>
        <health>48</health>
        <skill id="barrierall" x="2"/>
        <skill id="strike" x="6"/>
        <skill id="leech" x="9"/>
      </upgrade>
      <upgrade>
        <level>13</level>
        <health>49</health>
        <skill id="barrierall" x="2"/>
        <skill id="strike" x="6"/>
        <skill id="leech" x="10"/>
      </upgrade>
      <upgrade>
        <level>14</level>
        <health>51</health>
        <attack>10</attack>
        <skill id="barrierall" x="2"/>
        <skill id="strike" x="7"/>
        <skill id="leech" x="10"/>
      </upgrade>
      <upgrade>
        <level>15</level>
        <health>53</health>
        <skill id="barrierall" x="2"/>
        <skill id="strike" x="7"/>
        <skill id="leech" x="11"/>
      </upgrade>
      <upgrade>
        <level>16</level>
        <health>54</health>
        <attack>11</attack>
      </upgrade>
      <upgrade>
      <level>17</level>
        <health>56</health>
        <skill id="barrierall" x="3"/>
        <skill id="strike" x="7"/>
        <skill id="leech" x="11"/>
      </upgrade>
      <upgrade>
        <level>18</level>
        <health>58</health>
        <skill id="barrierall" x="3"/>
        <skill id="strike" x="8"/>
        <skill id="leech" x="12"/>
      </upgrade>
    </unit>
  </root>`,
);

const combosRequestHandler: RestHandler = successfulGetHandler(
  ENDPOINTS.COMBOS,
  `<root>
    <combo>
      <card_id>15178</card_id>
      <cards card1="10009" card2="10051"/>
    </combo>
  </root>`,
);

const handlers: RestHandler[] = [cardsRequestHandler, combosRequestHandler];

export { handlers };
