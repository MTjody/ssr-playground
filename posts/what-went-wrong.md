---
title: "Oops - what went wrong?"
date: "2021-01-15"
tldr: "Tips and tricks for when things go south!"
---

## Precondition

- frequent git commits
- solve one issue at a time, divide larger tasks into smaller bits
- mark not working app/environment in commit title

## Decrypting error logs

- finding source errors i.e. where is the error coming from
- which application / source file did it start from
- which environment is throwing the error
- debug / verbose flags

## Narrow down the issue alt. divide and conquer

- how much or how little code can you have to recreate the issue?
- if you remove stuff from your code, does it work? No? keep removing. works now? start adding small increments

## Efficient debugging patterns

- console.log baby, tips and tricks

## Googling effectively

- which sources are to be checked, in which order?
- official docs, official Q&A,
- when using stackoverflow, github/other VCS app issues list, obscure forums, are the users having the same error, with a similar setup? i.e. is it related to your issue?

## When all else fails

- flip the steak, can you try other tactics? is there another equal solution?
