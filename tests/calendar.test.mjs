import assert from "node:assert/strict";
import test from "node:test";
import { forDate, freeTimes, included, positions, shift, weekOf } from "../app/kalendarz/calendar.ts";

const date = "2026-11-20";
const shared = { id: 1, person: "1,2", date, endDate: date, start: "08:30", end: "10:00", blocking: true };
test("wspólny wpis zajmuje dwie kolumny, a kolidujące wpisy otrzymują rozłączne miejsca", () => {
    const [tile] = positions([shared], date);
    assert.deepEqual([tile.left, tile.width, tile.start, tile.end], [0, 100, 510, 600]);
    const events = [shared, { ...shared, id: 2, person: "1" }, { ...shared, id: 3, person: "2" }];
    const blocks = positions(events, date).sort((a, b) => a.left - b.left);
    assert.equal(blocks.length, 3);
    for (let i = 1; i < blocks.length; i++) assert.ok(blocks[i-1].left + blocks[i-1].width <= blocks[i].left);
});
test("dostępność łączy zajęte przedziały i uwzględnia koniec wyłączny", () => {
    const overnight = { ...shared, date: "2026-11-19", start: "23:00", end: "09:00" };
    assert.deepEqual(freeTimes([shared, overnight, { ...shared, start:"10:00", end:"11:00", blocking:false }], date, 480,720,30), [{start:600,end:720}]);
    assert.deepEqual(forDate([{ ...overnight, end:"00:00" }], date), []);
    assert.deepEqual(freeTimes([{...shared, allDay:true, endDate:"2026-11-21",end:"00:00"}],date,480,720,30), []);
});
test("wybór terminu AGH jest ważniejszy niż rodzaj i grupa", () => {
    const entry = { source:"uid", course:"Grupa A", courseType:"W" };
    const choices = { type:{W:false}, course:{"Grupa A":true}, term:{uid:false} };
    assert.equal(included({choices}, entry),false);
    delete choices.term.uid;
    assert.equal(included({choices}, entry),true);
    delete choices.course["Grupa A"];
    assert.equal(included({choices}, entry),false);
});
test("miesiąc i tydzień obsługują granice roku i lata przestępne", () => {
    assert.equal(shift("2024-01-31","month",1),"2024-02-29");
    assert.equal(shift("2026-03-31","month",-1),"2026-02-28");
    assert.deepEqual(weekOf("2027-01-01").filter((_, i)=>i===0 || i===6),["2026-12-28","2027-01-03"]);
});
