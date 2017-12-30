Meme Generator
---
An awesome web app to generate random and static memes.

# Scenarios, Events, and kinds

Memes need content to generate! A single meme is a combination of a scenario, event, and kind.

## Kinds

The kind is a image file or URL to the meme.

## Scenarios

scenario set the scene for the meme and explain what's happening. This is best formatted in the form, "When [*the scenario*]".

## Event

The event explains what happens during or because of the scenario. This can be formatted as, "and [*the event*]" or "because [*the event*]". An event can also store a default kind, which will allow you to generate memes that have more purpose and meaning.

# Generating Memes

After you have created at least one Kind, Scenario, and Event (although you may want to create more than that!) you can generate either a **Spicy Meme** or a **Random Meme** by navigating to the `/spicymeme` or the `/randommeme` routes in your web browser, or by clicking on the buttons from the front page. You can also create a **Static Meme** with the Meme Builder from the front page.

## Spicy Meme

A Spicy Meme will consist of a random Scenario and Event, with a Kind that matches the Event.

**Notice:** An Event will not be selected for a Spicy Meme if it the Event does not have a default Kind.

## Random Meme

A Spicy Meme will consist of a random Scenario, Event, and Kind. These Memes may not always make sense, but you may get some pretty dank results!

## Static Memes

The Meme Builder will allow you to create and save Memes for the future. The Meme Builder will generate a URL, which you can use to get back to your Meme.

**Notice:** If you change or edit the Scenario, Event, or Kind of your meme, you could loose your meme if/when the cache is reset.

# Cache

Generating a Meme takes a few moments, so in order to deliver your dank Memes in a speedy fashion, we will cache the Memes. In order to regenerate a Meme, add `?cached=false` to the end of the Meme URL. This works for Spicy, Random, and Static Memes.

# URLS

Spicy, Random, and Static Memes can be accessed using a short name `/spicymeme` or with a JPG file extension `/spicymeme.jpg`. 
