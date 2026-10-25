"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  lessonKey,
  loadBookmarks,
  loadCompleted,
  loadNotes,
  saveBookmarks,
  saveCompleted,
  saveLessonNote,
  setLastLesson,
} from "@/lib/progress";

export function MarkCompleteButton(props: {
  track: "core" | "springboard";
  module?: number;
  week?: string;
  slug: string;
}) {
  const key = lessonKey(props);
  const [done, setDone] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [noteText, setNoteText] = React.useState("");
  const [noteSavedMsg, setNoteSavedMsg] = React.useState(false);

  // "Listen in the Truck" Audio SOP Mode
  const [speaking, setSpeaking] = React.useState(false);
  const [rate, setRate] = React.useState<1 | 1.25 | 1.5>(1);

  React.useEffect(() => {
    const refresh = () => {
      setDone(loadCompleted().has(key));
      setBookmarked(loadBookmarks().has(key));
      const notes = loadNotes();
      setNoteText(notes[key] ?? "");
    };
    refresh();
    setLastLesson(key);
    window.addEventListener("tbsa:progress", refresh as any);
    return () => {
      window.removeEventListener("tbsa:progress", refresh as any);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [key]);

  function startSpeech(targetRate: 1 | 1.25 | 1.5) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Audio playback is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const articleEl = document.querySelector(".markdown");
    const rawText = articleEl ? (articleEl as HTMLElement).innerText : document.body.innerText;
    if (!rawText) return;

    const utter = new SpeechSynthesisUtterance(rawText);
    utter.rate = targetRate;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  }

  function toggleAudio() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      startSpeech(rate);
    }
  }

  function cycleRate() {
    const nextRate: 1 | 1.25 | 1.5 = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1;
    setRate(nextRate);
    if (speaking) {
      startSpeech(nextRate);
    }
  }

  function toggleComplete() {
    const set = loadCompleted();
    if (set.has(key)) set.delete(key);
    else set.add(key);

    try {
      const today = new Date().toISOString().slice(0, 10);
      const raw = window.localStorage.getItem("tbsa.activityDays.v1");
      const obj = raw ? JSON.parse(raw) : {};
      obj[today] = (obj[today] ?? 0) + 1;
      window.localStorage.setItem("tbsa.activityDays.v1", JSON.stringify(obj));
    } catch {
      // ignore
    }

    saveCompleted(set, "set");
    setDone(set.has(key));
    window.dispatchEvent(new CustomEvent("tbsa:progress"));
  }

  function toggleBookmark() {
    const set = loadBookmarks();
    if (set.has(key)) set.delete(key);
    else set.add(key);
    saveBookmarks(set, true);
    setBookmarked(set.has(key));
  }

  function handleSaveNote() {
    saveLessonNote(key, noteText, true);
    setNoteSavedMsg(true);
    setTimeout(() => setNoteSavedMsg(false), 2000);
  }

  const hasSavedNote = Boolean(loadNotes()[key]);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button
        variant={speaking ? "default" : "outline"}
        size="sm"
        onClick={toggleAudio}
        title="Hands-free Truck Audio SOP Mode"
      >
        {speaking ? "⏹ Stop Audio" : "🎧 Listen"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={cycleRate}
        title="Change Audio Speed (1x / 1.25x / 1.5x)"
      >
        {rate}x
      </Button>
      <Button
        variant={bookmarked ? "secondary" : "outline"}
        size="sm"
        onClick={toggleBookmark}
        title="Bookmark this SOP to your Dashboard"
      >
        {bookmarked ? "★ Saved" : "☆ Save SOP"}
      </Button>
      <Button
        variant={hasSavedNote || noteOpen ? "secondary" : "outline"}
        size="sm"
        onClick={() => setNoteOpen((v) => !v)}
        title="Add or view personal rig & field notes for this lesson"
      >
        {hasSavedNote ? "📝 Note ✓" : "📝 Note"}
      </Button>
      <Button variant={done ? "secondary" : "outline"} size="sm" onClick={toggleComplete}>
        {done ? "✓ Completed" : "Mark complete"}
      </Button>

      {noteOpen ? (
        <div className="mt-2 w-full rounded-xl border bg-card/95 p-3 shadow-lg">
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Personal Field &amp; Rig Notes (syncs across devices when signed in)</span>
            {noteSavedMsg ? <span className="text-primary">Saved ✓</span> : null}
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="E.g., Our 12V manifold ratio for this SOP, orifice size, or crew reminders…"
            className="w-full rounded-lg border bg-background/60 p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setNoteOpen(false)}>
              Close
            </Button>
            <Button size="sm" onClick={handleSaveNote}>
              Save Field Note
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
