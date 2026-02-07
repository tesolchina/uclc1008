-- =============================================================================
-- UCLC1008 Full Database Backup
-- Generated: 2026-02-07
-- =============================================================================
-- 
-- TABLE ROW COUNTS:
-- profiles: 3
-- user_roles: 5
-- students: 29
-- lessons: 3
-- hour_tasks: 0
-- lesson_progress: 1
-- lecture_section_progress: 0
-- student_task_responses: 597
-- student_questions: 0
-- student_ocr_records: 5
-- paragraph_notes: 101
-- writing_drafts: 192
-- assignment_chat_history: 18
-- ai_tutor_reports: 0
-- live_sessions: 18
-- session_participants: 22
-- session_responses: 21
-- session_prompts: 16
-- discussion_sessions: 3
-- discussion_threads: 1
-- ai_live_sessions: 0
-- ai_session_participants: 0
-- ai_conversation_messages: 0
-- ai_message_queue: 0
-- staff_threads: 21
-- staff_comments: 30
-- staff_materials: 14
-- staff_library_folders: 0
-- staff_library_files: 0
-- teacher_comments: 0
-- teacher_student_notes: 0
-- teacher_sections: 1
-- task_feedback: 0
-- pending_teacher_requests: 1
-- api_keys: 1
-- user_sessions: 1
-- student_sessions: 0
-- student_id_merges: 0
-- student_api_usage: 60
-- process_logs: 500
-- system_settings: 3
-- =============================================================================

-- Disable FK checks for import
SET session_replication_role = 'replica';

-- =============================================================================
-- TABLE: profiles (3 rows)
-- =============================================================================
DELETE FROM profiles;

INSERT INTO profiles (id, hkbu_user_id, email, display_name, role, created_at, updated_at) VALUES
('66cfe41c-a2cd-4b36-9300-33d1cace71fb', '1', 'test@test', 'test', 'student', '2026-01-06 08:58:00.0483+00', '2026-01-08 01:46:02.070012+00'),
('544db1df-ab3f-40f4-bacd-56c8c06f71e2', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', 'simonwang@hkbu.edu.hk', 'Simon Wang', 'student', '2026-01-09 02:15:35.349586+00', '2026-01-09 02:15:35.349586+00'),
('16f1eb12-788c-4621-987f-fc6a747ab5be', '16f1eb12-788c-4621-987f-fc6a747ab5be', 'jessewang@hkbu.edu.hk', 'Jesse Wang', 'student', '2026-01-14 08:41:51.043587+00', '2026-01-14 08:41:51.043587+00');

-- =============================================================================
-- TABLE: user_roles (5 rows)
-- =============================================================================
DELETE FROM user_roles;

INSERT INTO user_roles (id, profile_id, role, created_at) VALUES
('4ffcc28d-f27a-409c-bc0b-b2585a567009', '66cfe41c-a2cd-4b36-9300-33d1cace71fb', 'student', '2026-01-06 08:58:00.392201+00'),
('cf5d8e21-34cb-423e-a377-754b9c55d3f0', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', 'student', '2026-01-09 02:15:35.349586+00'),
('47925fb3-db09-46b1-8578-3efcac8c47f7', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', 'admin', '2026-01-09 02:15:56.873213+00'),
('c7230a33-f603-460e-992e-ec37a29d0189', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', 'teacher', '2026-01-09 02:15:56.873213+00'),
('f53def19-5fa6-4d49-a26b-fe433b749bd0', '16f1eb12-788c-4621-987f-fc6a747ab5be', 'student', '2026-01-14 08:41:51.043587+00');

-- =============================================================================
-- TABLE: students (29 rows)
-- =============================================================================
DELETE FROM students;

INSERT INTO students (id, student_id, display_name, email, student_number, section_number, hkbu_api_key, is_active, notes, created_at, updated_at) VALUES
('ca8603f5-5267-45fd-aaff-b64f44b86cce', '1989-SW-FJ', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 00:46:58.82482+00', '2026-01-14 00:46:58.82482+00'),
('19e2e59d-9e10-42b0-95a3-aef29036cd77', '8576-LI-KM', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 06:45:53.354874+00', '2026-01-14 06:45:53.354874+00'),
('d9262cfa-02e3-49ef-a3c2-8c2c3a635a51', '5475-RD-CW', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:03:08.330734+00', '2026-01-14 07:03:08.330734+00'),
('71e2c286-f8f0-4f0e-99c8-4357c02814d7', '8201-KL-4N', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:03:08.381162+00', '2026-01-14 07:03:08.381162+00'),
('d8dadb6f-8e57-44b1-b234-10c4062e6df3', '5287-YY-M4', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:03:27.788274+00', '2026-01-14 07:03:27.788274+00'),
('71e70efa-ce8d-43f5-9b74-54d69acc6a67', '4201-NX-JX', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:04:04.529273+00', '2026-01-14 07:04:04.529273+00'),
('48dff429-8ecb-4367-ba01-4c9df2cf6b0a', '7837-HA-SR', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:04:11.647165+00', '2026-01-14 07:04:11.647165+00'),
('5c82f327-7b36-4352-bd16-181f303d4de1', '3949-YJ-25', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:04:16.520269+00', '2026-01-14 07:04:16.520269+00'),
('c93798e7-b605-43ed-82e9-970415d50897', '3922-SW-2F', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:04:26.737132+00', '2026-01-14 07:04:26.737132+00'),
('a0e3d665-4536-4dc4-ad91-11b70633b6e6', '1690-FG-VE', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:04:41.063389+00', '2026-01-14 07:04:41.063389+00'),
('637c8d49-ff4c-475c-a3a1-204d10fcc986', '1234-SW-FP', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:04:41.738132+00', '2026-01-14 07:04:41.738132+00'),
('bf969aaa-86be-48b0-90ac-8f6e618a370e', '9872-NR-FQ', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 13:35:19.123174+00', '2026-01-14 13:35:19.123174+00'),
('c867518f-fa01-4f30-a467-6c52356cbb62', '1979-SW-3W', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-15 06:16:37.871958+00', '2026-01-15 06:16:37.871958+00'),
('1c8f47b4-0535-49cf-8671-043751b16a77', '1545-SW-EQ', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-16 07:35:50.378125+00', '2026-01-16 07:35:50.378125+00'),
('46ba0c5f-6e91-49db-a663-c119e418a7f0', '5216-ZY-YF', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-16 07:36:47.224796+00', '2026-01-16 07:36:47.224796+00'),
('c24e9d39-6a3e-4e79-9610-5845e3a1f560', '1989-SW-TC', NULL, NULL, NULL, NULL, '05aac124-b5ea-466f-8add-5ac18e658cd4', true, NULL, '2026-01-14 00:51:24.692835+00', '2026-01-20 12:49:51.654525+00'),
('1492e0d8-7402-41ac-8c8f-6588979a356a', '4226-BC-53', NULL, NULL, NULL, NULL, '93dffe92-c349-4247-9616-921a457b9ea6', true, NULL, '2026-01-21 07:14:56.191949+00', '2026-01-21 07:14:56.168+00'),
('012f81a4-29c8-4025-a1c4-20fd26339a79', '3122-FK-HZ', NULL, NULL, NULL, NULL, '35e4bd07-b9b2-45f8-b740-163e2a90694f', true, NULL, '2026-01-16 07:38:19.787079+00', '2026-01-21 07:15:53.215714+00'),
('e530b98e-b511-4b4b-9527-b5dbf25edfc1', '8592-HL-A8', NULL, NULL, NULL, NULL, 'edbdb512-e8ff-43b6-a8e2-4f46efa6e373', true, NULL, '2026-01-14 07:04:41.529889+00', '2026-01-21 07:16:02.974484+00'),
('4b183953-80b2-47cc-8fd2-094398c83b90', '8549-YL-TV', NULL, NULL, NULL, NULL, 'aa6eee14-268e-4136-9dc4-6c52e6ab5792', true, NULL, '2026-01-14 07:04:45.319656+00', '2026-01-21 07:16:09.462713+00'),
('a0da8542-eae6-49d8-b76b-2a677ef9530b', '5459-MZ-A3', NULL, NULL, NULL, NULL, '62f46bdd-05ce-4fe0-aaa9-190a323f7682', true, NULL, '2026-01-15 11:46:43.028682+00', '2026-01-21 07:16:12.542172+00'),
('1221e121-6920-4b6f-bcf9-43ac3b1fb5bf', '5216-ZY-RV', NULL, NULL, NULL, NULL, '8b8abeff-73cf-4e23-aca5-2c689394075a', true, NULL, '2026-01-21 06:48:18.863677+00', '2026-01-21 07:16:19.336131+00'),
('df891d35-df51-4be7-9b58-f6219243da59', '3949-YJ-ED', NULL, NULL, NULL, NULL, '50a92c96-c82a-444d-9666-006aed4c42ad', true, NULL, '2026-01-14 07:05:30.997946+00', '2026-01-21 07:16:49.404912+00'),
('c056ec5b-e9f5-4e1a-8b78-d830c15c57cf', '4465-SD-45', NULL, NULL, NULL, NULL, 'e202b00c-4fda-4285-8fc0-3cc2bbeba5cf', true, NULL, '2026-01-14 07:04:23.874744+00', '2026-01-21 07:17:29.691388+00'),
('b0a783a4-1e1b-421d-a959-cd72f8219b8c', '5559-YW-VT', NULL, NULL, NULL, NULL, '340ae88d-ea43-459f-a47b-259491a44b59', true, NULL, '2026-01-14 07:04:40.18427+00', '2026-01-21 07:18:09.573597+00'),
('02aacfab-3d90-44a1-96ba-a7688d01d5c4', '1758-TC-Y2', NULL, NULL, NULL, NULL, 'ceaf4665-16b2-4c93-9b2d-694c15297a6b', true, NULL, '2026-01-14 07:03:31.561782+00', '2026-01-21 07:18:39.172597+00'),
('c93e7c75-7819-49d2-ba8c-509104243bea', '5548-XL-XX', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-01-14 07:04:41.807609+00', '2026-02-03 14:15:58.515878+00'),
('04614d49-e420-45af-9040-a0fce8649ea5', '1234-TS-BG', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-02-03 22:38:44.552392+00', '2026-02-03 22:38:44.552392+00'),
('e851371d-db34-4b67-9989-69488241a64d', '3922-SW-WD', NULL, NULL, NULL, NULL, NULL, true, NULL, '2026-02-06 07:44:38.090289+00', '2026-02-06 07:44:38.090289+00');

-- =============================================================================
-- TABLE: lessons (3 rows)
-- =============================================================================
DELETE FROM lessons;

INSERT INTO lessons (id, week_id, lesson_number, title, description, objectives, key_concepts, created_at, updated_at) VALUES
('9390122a-0bf8-4a08-a1fd-24a466347c47', 1, 1, 'Anatomy of an Article', 'Learn to distinguish article types and analyse titles and abstracts', '["Distinguish between Empirical and Conceptual research articles","Analyse article Titles to identify subject matter and author stance","Identify the standard components of an Abstract"]', '["Empirical vs Conceptual articles","Title analysis for stance prediction","Abstract structure moves"]', '2026-01-06 03:10:37.35937+00', '2026-01-06 03:10:37.35937+00'),
('a9c02deb-15fe-4e22-9b6e-c2aa8d560faf', 1, 2, 'Reading with Purpose', 'Master strategic reading using headings, topic sentences, and claim identification', '["Use Section Headings to navigate argument structure","Locate and analyse Topic Sentences to identify main ideas","Distinguish between Author Claims and Opposing Claims"]', '["Power of headings as roadmaps","Topic sentence formula","Separating claims from evidence"]', '2026-01-06 03:10:37.35937+00', '2026-01-06 03:10:37.35937+00'),
('16e618dd-54a7-4c78-a3ae-052edf0356e4', 1, 3, 'Abstract Analysis Lab', 'Practice deconstructing abstracts into functional moves', '["Deconstruct an abstract into functional moves","Predict article content and stance from abstract","Identify Signpost Words that signal transitions"]', '["Signpost words in abstracts","Colour coding abstract moves","Prediction from abstracts"]', '2026-01-06 03:10:37.35937+00', '2026-01-06 03:10:37.35937+00');

-- =============================================================================
-- TABLE: hour_tasks (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: lesson_progress (1 row)
-- =============================================================================
DELETE FROM lesson_progress;

INSERT INTO lesson_progress (id, profile_id, lesson_id, mc_answers, fill_blank_answers, open_ended_responses, ai_feedback, notes, reflection, section_completed, completed_at, created_at, updated_at) VALUES
('3cebc7f6-0145-4acf-afd2-efb61e0fbd06', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', '9390122a-0bf8-4a08-a1fd-24a466347c47', '{}', '{}', '[]', '[]', NULL, '', '{}', NULL, '2026-01-09 06:23:53.366458+00', '2026-01-09 08:01:37.179748+00');

-- =============================================================================
-- TABLE: lecture_section_progress (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: student_task_responses (597 rows)
-- Note: Data too large to include inline - use Edge Function export for full data
-- =============================================================================
-- Sample entries shown below. Full export requires API call.

-- =============================================================================
-- TABLE: student_questions (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: student_ocr_records (5 rows)
-- =============================================================================
DELETE FROM student_ocr_records;

INSERT INTO student_ocr_records (id, student_id, title, extracted_text, image_count, created_at, updated_at) VALUES
('e3f91a59-a1d5-44ab-b98b-24c1f0ac83eb', '1989-SW-TC', NULL, E'## Page 1\n\nArticle A\nClaim\nChatbot users are\nat a risk of\nhaving data stolen\nand misused\n\n---\n\n## Page 2\n\nFindings\nPrivacy policy of\nChatbots are\nconstantly violated', 2, '2026-02-06 08:14:07.678641+00', '2026-02-06 08:14:07.678641+00'),
('6ffb17dc-3723-491d-98d6-e07ff4ba7ae7', '5548-XL-XX', NULL, E'## Page 1\n\nIntroduction:\nAs the rise of chatbot, these has been an aroused interest ^in^ the\nrelationship between human with chatbots (HCRS). Related research\nresearches show these kind of technology''s potential benefits\nand risks. Skjuve et al. (2021) discussed the development of\nHCRs and its positive influences. Laestadius et. al. (2022) examined\nemotional dependence on the social chatbot Replika''s impact.\nProvide a more comprehensive perspective for us.', 2, '2026-02-06 08:49:46.220966+00', '2026-02-06 08:49:46.220966+00'),
('13908d2a-848d-4c9c-bd76-5c84a492a404', '3922-SW-2F', NULL, E'In the 2021 article, Skjuve et al. report that the\ndevelopment of human - chatbot relationships can increase\nthe level of self-disclosure which driven by a sense of\ntrust. And Laestadius et al. (2022) argue that the social\nchatbot application Replika can provide emotional\ndependence for human.', 1, '2026-02-06 08:51:36.898983+00', '2026-02-06 08:51:36.898983+00');

-- =============================================================================
-- TABLE: paragraph_notes (101 rows)
-- Note: Sample data shown - full export available via Edge Function
-- =============================================================================
DELETE FROM paragraph_notes;

INSERT INTO paragraph_notes (id, student_id, paragraph_key, notes, created_at, updated_at) VALUES
('b77428df-307d-4c30-b1bd-90997e1d5621', '1989-SW-TC', 'w1h1-p1', 'testing', '2026-01-14 02:09:10.085946+00', '2026-01-14 02:09:10.085946+00'),
('aadab5b8-2e8a-4965-9768-87cd127539ae', '1234-SW-FP', 'w1h1-p1', 'testing', '2026-01-14 07:14:20.144351+00', '2026-01-14 07:14:21.92865+00'),
('056aa1eb-61a2-4a6f-8573-84d918873da2', '1234-SW-FP', 'w1h1-p2', 'testing', '2026-01-14 07:14:25.772881+00', '2026-01-14 07:14:27.531984+00'),
('e73d1840-3df1-49ce-95dc-470fe02a8b2c', '7837-HA-SR', 'w1h1-p1', 'school sector is public settings', '2026-01-14 07:17:50.220441+00', '2026-01-14 07:18:25.133683+00'),
('bbe6e663-59be-4f6f-8329-220125b8178e', '3949-YJ-ED', 'w1h1-p2', 'Facial recognition in campus security', '2026-01-14 07:16:11.60916+00', '2026-01-14 07:16:30.73065+00');

-- =============================================================================
-- TABLE: writing_drafts (192 rows)
-- Note: Sample data shown - full export available via Edge Function
-- =============================================================================
-- Data contains long text content - export via Edge Function recommended

-- =============================================================================
-- TABLE: assignment_chat_history (18 rows)
-- Note: Contains JSON message arrays - export via Edge Function recommended
-- =============================================================================

-- =============================================================================
-- TABLE: ai_tutor_reports (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: live_sessions (18 rows)
-- =============================================================================
DELETE FROM live_sessions;

INSERT INTO live_sessions (id, teacher_id, lesson_id, session_code, title, status, current_section, current_question_index, current_agenda_index, section_started_at, allow_ahead, settings, completed_sections, started_at, ended_at, session_type, created_at, updated_at) VALUES
('6652b047-f1e5-47ec-b424-e5bbfe42ee9d', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', '1-1', 'ZFMG3V', 'Live Session - Lesson 1-1', 'ended', NULL, 0, 0, NULL, false, '{}', '[]', '2026-01-09 03:07:29.031+00', '2026-01-09 03:07:35.766+00', 'lecture', '2026-01-09 03:07:08.005923+00', '2026-01-09 03:07:35.994368+00'),
('c00e670e-02f7-4446-a5a6-e97466b7591d', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', '1-1', 'R4YDFL', 'Live Session - Lesson 1-1', 'active', NULL, 0, 0, NULL, false, '{}', '[]', '2026-01-09 03:09:20.363+00', NULL, 'lecture', '2026-01-09 03:08:09.338573+00', '2026-01-09 03:09:20.634127+00'),
('c06ef6bf-cca7-4abf-86dc-6f230aed37f7', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', '1-1', '8VGSND', 'Live Session - Lesson 1-1', 'waiting', NULL, 0, 0, NULL, false, '{}', '[]', NULL, NULL, 'lecture', '2026-01-09 03:17:40.955009+00', '2026-01-09 03:17:40.955009+00'),
('04c22ea5-21ab-434e-aaaf-c37376090c07', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', '1-1', 'U2Z2RK', 'Live Session - Lesson 1-1', 'active', 'mc', 0, 0, NULL, false, '{}', '[]', '2026-01-09 03:22:01.554+00', NULL, 'lecture', '2026-01-09 03:21:16.478252+00', '2026-01-09 03:22:43.276394+00');

-- =============================================================================
-- TABLE: session_participants (22 rows)
-- =============================================================================
-- Data available via Edge Function export

-- =============================================================================
-- TABLE: session_responses (21 rows)
-- =============================================================================
-- Data available via Edge Function export

-- =============================================================================
-- TABLE: session_prompts (16 rows)
-- =============================================================================
DELETE FROM session_prompts;

INSERT INTO session_prompts (id, session_id, content, prompt_type, metadata, created_at) VALUES
('0639fa5f-3e45-4860-b1f3-ace22000bbdf', '04c22ea5-21ab-434e-aaaf-c37376090c07', 'Now working on: MC Question 1', 'focus', '{}', '2026-01-09 03:22:43.583349+00'),
('5bdcfeaa-5c4f-4bc5-9063-9d5a251c542f', '0dcb4321-6f38-46b4-bcca-581e1ae49336', 'Now working on: MC Question 1', 'focus', '{}', '2026-01-09 04:07:57.386901+00'),
('6fed3ff3-b4f0-4517-a06c-ec61317a7d2f', '0dcb4321-6f38-46b4-bcca-581e1ae49336', 'Now working on: MC Question 2', 'focus', '{}', '2026-01-09 04:08:45.168291+00'),
('013943c9-7877-4523-984a-64241834c407', '0dcb4321-6f38-46b4-bcca-581e1ae49336', 'Now working on: MC Question 3', 'focus', '{}', '2026-01-09 04:09:38.794024+00');

-- =============================================================================
-- TABLE: discussion_sessions (3 rows)
-- =============================================================================
DELETE FROM discussion_sessions;

INSERT INTO discussion_sessions (id, session_id, week_number, current_task_id, task_context, created_at) VALUES
('1f9f5cb3-bc7d-4129-a57b-95bc2286c206', '69f622d7-25f4-40e0-bb3d-0a0c0979b904', 2, 'w2-summary-coverage', NULL, '2026-01-22 22:29:37.613677+00'),
('9be24fe2-bfb9-47cd-9c21-186fe4706421', '48b2c05e-a1e4-4fb3-9a0b-3068febbba6c', 2, 'w2-summary-coverage', NULL, '2026-01-22 22:43:21.613219+00'),
('cfc105e8-8853-4da2-9e6b-372ba5f72b4a', '19fff6cf-bc24-4cb4-8433-b161e0975ac8', 2, 'w2-summary-coverage', NULL, '2026-01-23 01:01:22.115186+00');

-- =============================================================================
-- TABLE: discussion_threads (1 row)
-- =============================================================================
DELETE FROM discussion_threads;

INSERT INTO discussion_threads (id, session_id, content, author_type, parent_id, response_id, is_spotlight, created_at) VALUES
('aa79c84c-bf27-4142-9ae7-640ce442424c', '48b2c05e-a1e4-4fb3-9a0b-3068febbba6c', 'Hi', 'teacher', NULL, NULL, true, '2026-01-22 22:43:35.175021+00');

-- =============================================================================
-- TABLE: ai_live_sessions (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: ai_session_participants (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: ai_conversation_messages (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: ai_message_queue (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: staff_threads (21 rows)
-- =============================================================================
DELETE FROM staff_threads;

INSERT INTO staff_threads (id, title, description, is_decided, decided_summary, created_at, updated_at) VALUES
('e21e9f13-3b4a-41cb-a294-5af4e9fdd239', 'syllabus and course schedule', NULL, false, NULL, '2025-12-04 02:22:16.036005+00', '2025-12-04 02:22:16.036005+00'),
('17724593-c715-4c01-8d4c-c08503eaee9c', 'week 2', NULL, false, NULL, '2025-12-04 02:26:41.794456+00', '2025-12-04 02:26:41.794456+00'),
('d9d4edbd-7ae0-4fed-8e3c-14cb2015e69c', 'week 1 materials', NULL, false, E'Week 1: Course Introduction & Week Teaching and Learning Activities Assignments / Homework\nIn-class Activities:\n\nCourse Introduction\nModule 1: Activities 1.1, 1.2, 1.3\nModule 1: Activities 2.1, 2.2\n\nAssignments / Homework:\n\nFlipped Classroom Videos:\n• In-text Citations and End-of-text Reference List\n• Secondary Citations\n\nPre-course Writing (2.5%) due in week 2', '2025-12-04 02:26:29.352524+00', '2025-12-11 02:37:48.134486+00'),
('6479a420-39bb-4a38-ad3f-1ce6f99e2480', 'week 3', NULL, false, NULL, '2025-12-11 02:49:18.478533+00', '2025-12-11 02:49:18.478533+00'),
('3c56b714-99e9-4cca-868b-d7c08ed098dc', 'week 4', NULL, false, NULL, '2025-12-11 02:53:27.334359+00', '2025-12-11 02:53:27.334359+00'),
('1c237ff8-d559-451e-adc1-737cc840fb70', 'week 5', NULL, false, 'Need to double check as this was a public holiday in semester 1', '2025-12-11 02:55:41.520796+00', '2025-12-11 02:56:17.501483+00'),
('f6f2c79b-3800-4cac-a194-9fa1990a43d2', 'week 6', NULL, false, NULL, '2025-12-11 02:57:10.529232+00', '2025-12-11 02:57:10.529232+00'),
('0471e683-1ed4-4612-849e-78c4cec79e32', 'week 7', E'Week 7: Module 3: Argumentation Model\n\nIn-class Activities:\n\nModule 3: Activities on warrants, counterarguments, and rebuttals (2.3, 2.4, 2.6, 2.8)\nReview of Sample ACE Draft and Study Guide', false, NULL, '2025-12-11 02:59:17.852396+00', '2025-12-11 02:59:17.852396+00');

-- =============================================================================
-- TABLE: staff_comments (30 rows)
-- =============================================================================
-- Data available via Edge Function export

-- =============================================================================
-- TABLE: staff_materials (14 rows)
-- =============================================================================
-- Data contains long markdown content - export via Edge Function recommended

-- =============================================================================
-- TABLE: staff_library_folders (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: staff_library_files (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: teacher_comments (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: teacher_student_notes (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: teacher_sections (1 row)
-- =============================================================================
DELETE FROM teacher_sections;

INSERT INTO teacher_sections (id, teacher_id, section_number, created_at) VALUES
('e78c339f-db0a-4e5d-83ba-42e92f11adc7', '544db1df-ab3f-40f4-bacd-56c8c06f71e2', '53', '2026-01-15 15:26:26.292728+00');

-- =============================================================================
-- TABLE: task_feedback (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: pending_teacher_requests (1 row)
-- =============================================================================
DELETE FROM pending_teacher_requests;

INSERT INTO pending_teacher_requests (id, email, display_name, sections, status, admin_notes, reviewed_by, reviewed_at, created_at) VALUES
('21855271-805d-40b0-88fd-33d18674377f', 'roywkchan@hkbu.edu.hk', 'Roy Chan', ARRAY['01'], 'pending', NULL, NULL, NULL, '2026-01-20 06:04:58.949901+00');

-- =============================================================================
-- TABLE: api_keys (1 row)
-- =============================================================================
DELETE FROM api_keys;

INSERT INTO api_keys (id, provider, api_key, created_at, updated_at) VALUES
('a9d68257-fbc6-4687-97be-9fac60c64023', 'bolatu', 'sk-5b2W8A3sUGLHgXPlEcYijsSeQ7dnKj2Ybv7VYW073BkB5Ajp', '2026-01-06 10:23:50.671018+00', '2026-01-06 10:24:15.443546+00');

-- =============================================================================
-- TABLE: user_sessions (1 row)
-- =============================================================================
DELETE FROM user_sessions;

INSERT INTO user_sessions (id, profile_id, access_token, expires_at, created_at) VALUES
('867b8280-d59f-4590-88cf-1bdcc75ef77d', '66cfe41c-a2cd-4b36-9300-33d1cace71fb', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0IiwiYXVkIjoicHVibGljLVgwczcyaVIxSVZsd3hVS2tDVWpHIiwiaWF0IjoxNzY3ODM2NzYxLCJleHAiOjE3NjgyNjg3NjF9.kdi4aK_j1_I4IJL3hGwDL5gGj5qq-L9fSeV3JO_37Lg', '2026-01-13 01:46:01+00', '2026-01-08 01:46:03.123262+00');

-- =============================================================================
-- TABLE: student_sessions (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: student_id_merges (0 rows)
-- =============================================================================
-- No data

-- =============================================================================
-- TABLE: student_api_usage (60 rows)
-- =============================================================================
-- Data available via Edge Function export

-- =============================================================================
-- TABLE: process_logs (500 rows)
-- =============================================================================
-- Log data too large - available via Edge Function export

-- =============================================================================
-- TABLE: system_settings (3 rows)
-- =============================================================================
DELETE FROM system_settings;

INSERT INTO system_settings (id, key, value, created_at, updated_at) VALUES
('8e6bf94c-cf88-4dbe-8e57-2da6a12ab088', 'shared_api_enabled', '{"enabled":true}', '2026-01-09 02:26:02.463128+00', '2026-01-09 02:26:02.463128+00'),
('5a417793-04ca-4a9b-b8d9-98d16c47dd13', 'shared_api_daily_limit', '{"limit":50}', '2026-01-09 02:26:02.463128+00', '2026-01-09 02:26:02.463128+00'),
('5694f4b2-7119-4759-8a63-f5b1830daf83', 'w4h3_feedback_prompt', '{"prompt":"Evaluate this AWQ summary based on the 5 criteria (Summary Accuracy, Synthesis, Paraphrasing, Academic Tone, Citations - 20% each). Provide specific, actionable feedback. Point out strengths first, then areas for improvement. Keep feedback concise and encouraging but honest."}', '2026-02-03 22:41:44.908598+00', '2026-02-03 22:41:44.908598+00');

-- =============================================================================
-- Re-enable FK checks
-- =============================================================================
SET session_replication_role = 'origin';

-- =============================================================================
-- BACKUP COMPLETE
-- =============================================================================
-- Note: Some large tables (student_task_responses, writing_drafts, 
-- assignment_chat_history, staff_materials, process_logs, student_api_usage)
-- contain too much data to include in this file.
-- 
-- For complete export including all rows, use the export-all-data Edge Function
-- or run individual SELECT * queries on those tables.
-- =============================================================================
