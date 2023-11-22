import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const [output, setOutput] = useState('');

    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    const compileAndRun = async () => {
        // Get the code from the editor
        const code = editorRef.current.getValue();

        // Send the code to Repl.it for compilation and execution
        try {
            const response = await fetch('https://replit.com/api/v0/repls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: 'cpp',
                    code,
                }),
            });

            if (response.ok) {
                const result = await response.json();

                // Check if the result contains output
                if (result.output !== undefined) {
                    setOutput(result.output);
                } else {
                    // If output is not available, check for other fields
                    if (result.stdout !== undefined) {
                        setOutput(result.stdout);
                    } else {
                        // If none of the expected fields are present, display an error
                        setOutput('Error: Unable to retrieve output.');
                    }
                }
            } else {
                const errorResult = await response.json();
                setOutput(`Error: ${errorResult.error}`);
            }
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container">
            <textarea id="realtimeEditor"></textarea>
            <button className="btn floating-button" onClick={compileAndRun}>
                Compile & Run
            </button>

            {output && (
                <div className="output-canvas">
                    <button onClick={() => setOutput('')} className="btn closeBtn">Close</button>
                    <pre>{output}</pre>
                </div>
            )}
        </div>
    );
};

export default Editor;