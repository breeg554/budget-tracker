import { json } from '@remix-run/node';

import { Buildel } from '~/libs/Buildel';
import { actionHandler } from '~/utils/action.server';

const t =
  "Evapify Poland SP. z 0.0. | UL. Gimnazjalna 18 01-346 Warszawa E.Leclerc Aleja Tadeusza Rejtana 69 35-325 Rzeszów NIP 52/298054' nr: 4526 PARAGON FISKALNY CRYSTAL PLUS Katernelon Ice Ż Ż x19,90 39,80A SPRZEDAZ OPODATKOWANA A 19.80 PTU A 23% 6 [ SUKA PTU 744 SUMA PLN 39,80 ROZLICZENIE PŁATNOŚCI GOTÓWKA 99,80 PLN 60008 4001 KIEROWNIK 2024-04-26 16:04 9456AF CF 380752750CC372DAŁB29ZE 3868EF 6071 ZZ EBA 1901876979 Ne transakcji: nonee KZCN6GCTLŚ Kasjer: Anna";

export const action = actionHandler({
  post: async ({ request }, { fetch }) => {
    const body = await request.json();

    const buildel = new Buildel(36, 153, process.env.BUILDEL_SECRET as string);

    const { data: run } = await buildel.createRun();
    await buildel.startRun(run.id);
    await buildel.input(run.id, body.text);

    return json({});
  },
});
